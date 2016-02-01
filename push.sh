#!/bin/bash

rm -rf deploy
hyde gen -c site_prod.yaml
rsync -Pavz deploy/* londonoconnor@londonoconnor.com:/home/londonoconnor/public_html
rm -rf deploy
