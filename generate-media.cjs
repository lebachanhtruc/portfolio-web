const fs = require('fs');
const path = require('path');

const mediaDir = path.resolve(__dirname, 'public/Media');
const outputJsonPath = path.resolve(__dirname, 'src/data/projects.json');

if (!fs.existsSync(path.resolve(__dirname, 'src/data'))) {
  fs.mkdirSync(path.resolve(__dirname, 'src/data'), { recursive: true });
}

function parseProjects() {
  const categories = ['AI GRaphic design + photo shoot', 'still life photography', 'videography and editing'];
  const projectsData = [];

  categories.forEach(category => {
    const categoryPath = path.join(mediaDir, category);
    if (!fs.existsSync(categoryPath)) return;

    const projectFolders = fs.readdirSync(categoryPath).filter(f => fs.statSync(path.join(categoryPath, f)).isDirectory());

    projectFolders.forEach(folder => {
      const folderPath = path.join(categoryPath, folder);
      const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
      
      const mediaFiles = files.filter(f => /\.(jpg|jpeg|png|mp4|mov)$/i.test(f));
      const standalone = [];
      const pairs = []; // keep this empty array to prevent undefined error in projectsData.push

      mediaFiles.forEach(f => {
        standalone.push(`/Media/${category}/${folder}/${f}`);
      });

      // Sort standalone alphabetically to group similar names, but push hero to front
      standalone.sort((a, b) => {
        if (a.toLowerCase().includes('real tv')) return -1;
        if (b.toLowerCase().includes('real tv')) return 1;
        
        // Project 3 hero image (Green duck photo / Stack 2)
        if (a.includes('Stack 2')) return -1;
        if (b.includes('Stack 2')) return 1;

        // Custom sort for Project 1 (8 images: move Salade to far right)
        if (folder.includes('Project 1 -')) {
          const project1Order = [
            '2024 Jun 05 - SHUSHUTO x Singapore9252.jpg', // P3: Crab Photo
            '2024 Jun 05 - SHUSHUTO x Singapore9324.jpg', // P4: Ramen Photo
            'set-1.png',                                  // P8: Set Menu Photo
            '2024 Jun 05 - SHUSHUTO x Singapore9185.jpg', // P2: Salade Photo
            
            '2024_Jun_05_-_SHUSHUTO_202607251135.jpeg',   // P5: Crab Poster
            '2024_Jun_05_-_SHUSHUTO_202607251136.jpeg',   // P6: Ramen Poster
            'set-1- edited.png',                          // P7: Set Menu Poster
            '2024 Jun 05 - SHUSHUTO x Singapore9185- edited.png' // P1: Salade Poster
          ];
          const aName = a.split('/').pop();
          const bName = b.split('/').pop();
          const aIndex = project1Order.indexOf(aName);
          const bIndex = project1Order.indexOf(bName);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
        }

        // Custom sort for Project 4 (align posters to photos: Meat, Beef, Seafood, Duck)
        if (folder.includes('Project 4 -')) {
          const project4Order = [
            '2025 Nov 06 - SHUSHUTO Spring Menu Set0229.jpg', // Photo: Meat
            '2025 Nov 06 - SHUSHUTO Spring Menu Set0246.jpg', // Photo: Beef
            '2025 Nov 06 - SHUSHUTO Spring Menu Set0280.jpg', // Photo: Seafood
            '2025 Nov 06 - SHUSHUTO Spring Menu Set0403.jpg', // Photo: Duck
            '2025_Nov_06_-_SHUSHUTO_202607251117.jpeg',       // Poster: Meat
            '2025_Nov_06_-_SHUSHUTO_202607251127.jpeg',       // Poster: Beef
            '2025_Nov_06_-_SHUSHUTO_202607251122.jpeg',       // Poster: Seafood
            '2025_Nov_06_-_SHUSHUTO_202607251123.jpeg'        // Poster: Duck
          ];
          const aName = a.split('/').pop();
          const bName = b.split('/').pop();
          const aIndex = project4Order.indexOf(aName);
          const bIndex = project4Order.indexOf(bName);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
        }

        // Custom sort for Project 5 (group by original photo instead of by space vs underscore)
        if (folder.includes('Project 5 -')) {
          const project5Order = [
            'VALENTINE 01.png',
            'VALENTINE_01.png_4K_202607251157 (1).jpeg',
            'VALENTINE_01.png_4K_202607251157.jpeg',
            'VALENTINE 02.png',
            'VALENTINE_02.png_4K_202607251205 (1).jpeg',
            'VALENTINE_02.png_4K_202607251205.jpeg'
          ];
          const aName = a.split('/').pop();
          const bName = b.split('/').pop();
          const aIndex = project5Order.indexOf(aName);
          const bIndex = project5Order.indexOf(bName);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
        }

        // Custom sort for Project 6 (10 images: Photo A + posters + curry on row 1, Photo B + posters + grillade on row 2)
        if (folder.includes('Project 6 -')) {
          const project6Order = [
            '2023 Dec 14 - Chup hinh do an Lime8675.jpg',   // Photo A
            '2023_Dec_14_-_Chup_202607251209.jpeg',         // Poster A1
            '2023_Dec_14_-_Chup_202607251210.jpeg',         // Poster A2
            'I_want_to_2k_202512192022.jpeg',               // Curry
            
            '2023 Dec 14 - Chup hinh do an Lime8785.jpg',   // Photo B
            '2023_Dec_14_-_Chup_202607251213.jpeg',         // Poster B1
            '2023_Dec_14_-_Chup_202607251214.jpeg',         // Poster B2
            'I_want_to_2k_202512211151.jpeg',               // Grillade 1
            
            'Key_subject_nonnegotiable_2k_202512211347.jpeg', // Grillade 2
            'Key_subject_nonnegotiable_2k_202512221239.jpeg'  // Pho
          ];
          const aName = a.split('/').pop();
          const bName = b.split('/').pop();
          const aIndex = project6Order.indexOf(aName);
          const bIndex = project6Order.indexOf(bName);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
        }

        return a.localeCompare(b);
      });

      let categoryName = 'AI x Photography';
      if (category === 'still life photography') categoryName = 'Photography';
      if (category === 'videography and editing') categoryName = 'Videography';
      if (folder.toLowerCase().includes('videography')) categoryName = 'Videography';

      let brand = folder.includes('LXR') ? 'LXR' : (folder.includes('SHUSHU') ? 'SHUSHU' : 'Creative Studio');
      
      // Creative Titles
      let creativeTitle = folder.split('-')[0].trim();
      if (folder.toLowerCase().includes('product photography')) creativeTitle = 'Product Elegance';
      if (folder.toLowerCase().includes('food photography')) creativeTitle = 'The Culinary Art';
      if (folder.toLowerCase().includes('still life')) creativeTitle = 'Still Life Essence';
      if (folder.toLowerCase().includes('videography')) creativeTitle = 'Cinematic Motion';
      if (folder.toLowerCase().includes('tv')) creativeTitle = 'Broadcast Vision';

      projectsData.push({
        id: folder.replace(/[^a-zA-Z0-9]/g, ''),
        title: creativeTitle,
        category: categoryName,
        brand: brand,
        pairs: pairs,
        standalone: standalone
      });
    });
  });

  // Reorder projects so that Broadcast Vision (Project 9) comes before Cinematic Motion (Project 11)
  projectsData.sort((a, b) => {
    let weightA = a.title === 'Broadcast Vision' ? -1 : (a.title === 'Cinematic Motion' ? 1 : 0);
    let weightB = b.title === 'Broadcast Vision' ? -1 : (b.title === 'Cinematic Motion' ? 1 : 0);
    return weightA - weightB;
  });

  fs.writeFileSync(outputJsonPath, JSON.stringify(projectsData, null, 2));
  console.log(`Generated projects.json with ${projectsData.length} projects.`);
}

parseProjects();
