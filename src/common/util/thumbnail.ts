import * as thumbsupply from 'thumbsupply';

export async function createThumbnail({ path, mimetype }) {
  return (
    await thumbsupply.generateThumbnail(path, {
      //size: { height, width }, // or ThumbSize.LARGE
      size: { name: '240p', width: 240, height: 240 },
      timestamp: '25%', // or `30` for 30 seconds
      cacheDir: './public/thumbnail',
      forceCreate: true,
      mimetype: mimetype,
    })
  )
    .split('/')
    .pop();
}
