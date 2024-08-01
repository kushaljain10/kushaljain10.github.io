#!/bin/bash

# Change to the directory containing the SVG files
cd ./assets/Bros/dress || { echo "Failed to change directory"; exit 1; }

# Rename the files using a temporary name to avoid conflicts
for i in {0..68}; do
  temp_name="temp_$i.svg"
  if [ -f "$i.svg" ]; then
    sudo mv "$i.svg" "$temp_name" || { echo "Failed to rename $i.svg to $temp_name"; exit 1; }
  else
    echo "$i.svg does not exist"
    exit 1
  fi
done

# Rename the temporary files to the final names
for i in {0..68}; do
  new_index=$((i + 1))
  temp_name="temp_$i.svg"
  if [ -f "$temp_name" ]; then
    sudo mv "$temp_name" "$new_index.svg" || { echo "Failed to rename $temp_name to $new_index.svg"; exit 1; }
  else
    echo "$temp_name does not exist"
    exit 1
  fi
done