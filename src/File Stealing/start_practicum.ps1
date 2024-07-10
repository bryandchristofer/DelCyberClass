# Remote Docker host details
$remoteUser = "user-ssh"
$remotePort = 2375
$localPort = 2375
$primaryHost = "192.168.210.120"
$backupHost = "192.168.210.191"

# Function to check if SSH tunnel is already running
function Is-SSHTunnelRunning {
    $netstat = netstat -ano | Select-String ":$localPort\s"
    return $netstat -ne $null
}

# Function to start SSH tunnel with failover
function Start-SSHTunnel {
    foreach ($currentHost in @($primaryHost, $backupHost)) {
        if (Is-SSHTunnelRunning) {
            Write-Host "SSH tunnel is already running on port $localPort."
            return
        }

        Write-Host "Attempting to start SSH tunnel to $remoteUser@$currentHost..."
        $sshArgs = "-L $localPort`:127.0.0.1`:$remotePort $remoteUser@$currentHost -N"
        Start-Process ssh -ArgumentList $sshArgs -NoNewWindow -PassThru
        Start-Sleep -Seconds 5  # Sleep to ensure tunnel is established

        $netstat = netstat -ano | Select-String ":$localPort\s"
        if ($netstat -ne $null) {
            Write-Host "SSH tunnel established to $currentHost."
            return
        }

        Write-Host "Failed to establish SSH tunnel to $currentHost. Trying next host if available."
    }

    Write-Host "Failed to establish SSH tunnel to any hosts. Exiting."
    exit 1
}

# Function to kill process on a specific port
function Kill-ProcessOnPort {
    param (
        [int]$port
    )

    $netstat = netstat -ano | Select-String ":$port\s"
    if ($netstat) {
        $netstat -match "(\d+)$" | ForEach-Object {
            $pid = $matches[1]
            Stop-Process -Id $pid -Force
            Write-Host "Killed process $pid on port $port."
        }
    }
}

# Function to start backend server
function Start-BackendServer {
    Write-Host "Starting backend server..."
    Start-Process node -ArgumentList "FileStealingBackend.js" -NoNewWindow -PassThru
    Start-Sleep -Seconds 5  # Sleep to ensure the backend server starts
    $backendProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($null -eq $backendProcess) {
        Write-Host "Failed to start backend server. Exiting."
        exit 1
    }
    Write-Host "Backend server started."
}

# Main script execution
Start-SSHTunnel
Kill-ProcessOnPort -port 3003
Start-BackendServer
