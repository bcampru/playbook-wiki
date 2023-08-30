#!/bin/bash

array=("Clariant" "ECCBC" "Ilunion" "Nippon" "Roche" "Septodont" "Swisscard" "Vaillant" "YWS")

for i in "${array[@]}"
do
    if [ ! -d "./data/$i" ]; then
        mkdir "./data/$i"
    else
        echo "Directory $i already exists"
    fi
done