#!/bin/bash

array=("CCOO" "Clariant" "ECCBC" "Ilunion" "Nippon" "Roche" "Septodon" "Swisscard" "Vaillant" "YWS")

for i in "${array[@]}"
do
    if [ ! -d "./data/$i" ]; then
        mkdir "./data/$i"
    else
        echo "Directory $i already exists"
    fi
done