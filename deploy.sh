PS3='change version'
options=("patch" "minor" "major")
select opt in "${options[@]}"
do
  case $opt in
    "patch")
        ./build
        npm version patch
        npm publish
        echo "OK"
        ;;
    "minor")
        ./build
        npm version minor
        npm publish
        echo "OK"
        ;;
    "major")
        ./build
        npm version major
        npm publish
        echo "OK"
        ;;
    "exit")
        break
        ;;
    *) echo invalid option;;
  esac
done

# ./build
# # npm version minor
# # npm version major
# npm publish
