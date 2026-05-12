const fs = require('fs');

// Read the file
let content = fs.readFileSync('KTL.js', 'utf8');

// Change 1: Check if current URL is bookmarked (line ~17462)
content = content.replace(
    /const bookmarks = userPrefs\.bookmarks \|\| \{\};\s+const isBookmarked = !!bookmarks\[sceneKey\];/,
    `const bookmarks = userPrefs.bookmarks || {};
            const currentUrl = window.location.href;
            const isBookmarked = Object.values(bookmarks).some(b => b.url === currentUrl);`
);

// Change 2: Use URL as key when adding bookmark (line ~17522-17525)
content = content.replace(
    /bookmarks\[sceneKey\] = \{\s+url: pageUrl,\s+name: sceneName\s+\};/,
    `// Use URL as key to allow multiple bookmarks per scene
                const bookmarkKey = pageUrl;
                bookmarks[bookmarkKey] = {
                    url: pageUrl,
                    name: sceneName,
                    sceneKey: sceneKey
                };`
);

// Change 3: Find and delete bookmark by URL (line ~17530)
content = content.replace(
    /delete bookmarks\[sceneKey\];/,
    `// Find and delete bookmark by URL
                const bookmarkKey = Object.keys(bookmarks).find(key => bookmarks[key].url === pageUrl);
                if (bookmarkKey) {
                    delete bookmarks[bookmarkKey];
                }`
);

// Write the file back
fs.writeFileSync('KTL.js', content, 'utf8');
console.log('Bookmark URL fix applied successfully');
