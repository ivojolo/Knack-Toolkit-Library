const fs = require('fs');

// Read the file
let content = fs.readFileSync('KTL.js', 'utf8');

// Fix the persistent form click handler to check if selectId exists
const oldCode = `            $('.search-choice-close').off('click.ktl_removeoption').bindFirst('click.ktl_removeoption', function (e) {
                const [viewId, fieldId] = $(e.target).closest('.kn-input').find('.chzn-select').attr('id').split('-');

                setTimeout(() => {`;

const newCode = `            $('.search-choice-close').off('click.ktl_removeoption').bindFirst('click.ktl_removeoption', function (e) {
                const selectId = $(e.target).closest('.kn-input').find('.chzn-select').attr('id');
                if (!selectId) return; // Skip if not a form input (e.g., search filters)

                const [viewId, fieldId] = selectId.split('-');

                setTimeout(() => {`;

content = content.replace(oldCode, newCode);

// Write the file back
fs.writeFileSync('KTL.js', content, 'utf8');
console.log('Search filter fix applied successfully');
