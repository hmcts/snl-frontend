#!/bin/sh

# === INPUT PARAMS === 
output_file_path=$1
custom_vars_string=$2
# === INPUT PARAMS === 

# === FUNCTIONS === 
function getKey {
    echo $(__substringByEqualsSign $1 1)
}

function getValue {
    echo $(__substringByEqualsSign $1 2)
}

function __substringByEqualsSign {
    echo $(__substringBySign $1 '=' $2)
}

function __substringBySign {
    echo $1 | cut -d $2 -f $3
}

function echoFileContent {
    echo "$(cat $1)"
}
# === FUNCTIONS === 

# === INIT CODE === 
echo "Working directory: \n$(pwd)\n\n"
echo "Working directory contents:\n$(ls)\n\n"
echo "Output file path:\n$output_file_path\n\n"
echo "Custom vars string:\n$custom_vars_string\n\n"
# === INIT CODE === 

# === MAIN CODE ===

final_tfvars_lines=()
for custom_var_entry in $(echo $custom_vars_string | sed "s/;/ /g")
do
    custom_tfvars_key=($(getKey $custom_var_entry))
    custom_tfvars_value=($(getValue $custom_var_entry))

    final_tfvars_lines+=("$custom_tfvars_key=$custom_tfvars_value")
done

printf "%s\n" "${final_tfvars_lines[@]}" > $output_file_path

echo "Generated $output_file_path file content:"
echoFileContent $output_file_path

# === MAIN CODE ===