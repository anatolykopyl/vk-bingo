#!/bin/sh
for i in *.html; do 
  iconv -f windows-1251 -t UTF-8 $i > UTF8-$i; 
done