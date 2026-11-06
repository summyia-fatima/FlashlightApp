const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'assets', 'app-icon.png');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function generateIcons() {
  if (!fs.existsSync(input)) {
    throw new Error('Logo not found: assets/app-icon.png');
  }

  for (const [folder, size] of Object.entries(sizes)) {
    const outputFolder = path.join(
      __dirname,
      'android/app/src/main/res',
      folder,
    );

    fs.mkdirSync(outputFolder, { recursive: true });

    const image = await sharp(input)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();

    await sharp(image).png().toFile(path.join(outputFolder, 'ic_launcher.png'));

    const circle = Buffer.from(
      `<svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}"
        r="${size / 2}" fill="white"/>
      </svg>`,
    );

    await sharp(image)
      .composite([{ input: circle, blend: 'dest-in' }])
      .png()
      .toFile(path.join(outputFolder, 'ic_launcher_round.png'));

    console.log(`Generated ${folder}`);
  }

  console.log('All launcher icons generated!');
}

generateIcons().catch(console.error);
