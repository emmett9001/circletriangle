#!/bin/bash

hyde gen -c site_prod.yaml
rsync -Pavz deploy londonoconnor@londonoconnor.com:/home/londonoconnor/public_html/beta
