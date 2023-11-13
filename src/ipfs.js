const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://localhost:5001'); // Replace with your IPFS node's address


async function uploadFile(file) {
  const fileData = new FormData();
  fileData.append('file', file);

  const addedFile = await ipfs.add(fileData);
  const cid = addedFile.cid.toString();
  console.log('File uploaded to IPFS with CID:', cid);
  return cid;
}

async function retrieveFile(cid) {
  const data = await ipfs.cat(cid);
  console.log('File retrieved from IPFS:', data);
  return data;
}


module.exports = { uploadFile, retrieveFile };
