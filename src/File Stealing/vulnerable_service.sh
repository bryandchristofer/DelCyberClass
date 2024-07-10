#!/bin/bash
while true; do 
    { 
        echo -e 'HTTP/1.1 200 OK\r\n'; 
        cat /usr/src/app/my-files/12345qw.txt; 
    } | nc -l -p 9999; 
done
