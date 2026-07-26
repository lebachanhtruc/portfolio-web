import fs from 'fs';
import path from 'path';

const mediaDir = path.resolve(__dirname, 'public/Media');
const outputJsonPath = path.resolve(__dirname, 'src/data/projects.json');

// Ensure data directory exists
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
      
      const mediaFiles = files.filter(f => /\.(jpg|jpeg|png|mp4)$/i.test(f));
      
      // Separate into edited and original
      // "edited" is typically in the filename
      const editedFiles = mediaFiles.filter(f => /edited/i.test(f));
      const pairs = [];
      const standalone = [];

      // Find pairs
      editedFiles.forEach(edited => {
        // usually named like "set-1- edited.png" and "set-1.png"
        const baseNameMatch = edited.match(/(.*?)(?:-\s*edited|edited)/i);
        if (baseNameMatch) {
          const baseName = baseNameMatch[1].trim();
          const orig = mediaFiles.find(f => f !== edited && f.startsWith(baseName) && !/edited/i.test(f));
          if (orig) {
            pairs.push({
              edited: `/Media/${category}/${folder}/${edited}`,
              original: `/Media/${category}/${folder}/${orig}`
            });
          } else {
            standalone.push(`/Media/${category}/${folder}/${edited}`);
          }
        } else {
          standalone.push(`/Media/${category}/${folder}/${edited}`);
        }
      });

      // Add files that are not in pairs or already pushed
      mediaFiles.forEach(f => {
        if (!editedFiles.includes(f) && !pairs.find(p => p.original.endsWith(f))) {
          standalone.push(`/Media/${category}/${folder}/${f}`);
        }
      });

      let categoryName = 'AI Design';
      if (category === 'still life photography') categoryName = 'Photography';
      if (category === 'videography and editing') categoryName = 'Videography';
      if (folder.toLowerCase().includes('videography')) categoryName = 'Videography';

      projectsData.push({
        id: folder,
        title: folder.split('-')[0].trim(),
        category: categoryName,
        brand: folder.includes('LXR') ? 'LXR' : (folder.includes('SHUSHU') ? 'SHUSHU' : 'Creative'),
        pairs: pairs,
        standalone: standalone
      });
    });
  });

  fs.writeFileSync(outputJsonPath, JSON.stringify(projectsData, null, 2));
  console.log(`Generated projects.json with ${projectsData.length} projects.`);
}

parseProjects();
