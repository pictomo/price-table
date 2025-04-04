# bundle
npx esbuild price-table.js \
  --bundle \
  --platform=node \
  --format=cjs \
  --outfile=bundled.js

# make blob from script
node --experimental-sea-config sea-config.json

# make node binary
cp $(command -v node) price-table

# remove existing signature
codesign --remove-signature price-table

# inject blob into node binary
npx postject price-table NODE_SEA_BLOB sea-prep.blob \
  --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
  --macho-segment-name NODE_SEA

# sign the binary
codesign --sign - price-table