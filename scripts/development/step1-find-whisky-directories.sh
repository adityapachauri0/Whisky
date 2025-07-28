#!/bin/bash
# Step 1: Find all whisky-related directories

echo "=== STEP 1: Finding All Whisky Directories ==="
echo "Run this in your VPS web terminal:"
echo ""
echo "find / -type d -name '*whisky*' 2>/dev/null | grep -v '/proc' | grep -v '/sys' | sort"
echo ""
echo "This will show you every directory with 'whisky' in the name."
echo "Copy the output and share it with me."