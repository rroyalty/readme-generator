const inquirer = require('inquirer');
const fs = require('fs');
const menus = require('./menus.json');
const sections = ['Description', 'Installation', 'Usage', 'License', 'Contributing', 'Tests', 'Questions'];

let readmeJSON = {};

const newReadme = () => {
    readmeJSON = {};
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of your project?'
            },
            {
                type: 'input',
                name: 'github',
                message: 'What is your github username?'
            },
            {
                type: 'input',
                name: 'email',
                message: 'What is your e-mail address?'
            },
            {
                type: 'input',
                name: 'repo',
                message: 'What is the name of your repository?'
            }
        ]).then((data) => {
            readmeJSON["Title"] = `![badge](https://img.shields.io/github/license/${data.github}/${data.repo})\n\n# ${data.title}`;
            readmeJSON["Table of Contents"] = "";
            sections.forEach((ele) => {
                readmeJSON["Table of Contents"] = `${readmeJSON["Table of Contents"]}\n[${ele}](#${ele})  `;
                readmeJSON[`${ele}`] = "";
            }
            )
            readmeJSON["Questions"] = `If you have any questions you can find my GitHub profile and E-Mail address below:  \n\n[GitHub](https://github.com/${data.github}/)  \n[E-Mail](${data.email})`;
            commandMain();
        }).catch((err) => {
            console.log(err);
        })
}

const previewReadme = (title, toc, sections) => {
    const reduced = sections.reduce((accumulator, secEle) => { 
        return `${accumulator}\n---\n<a name="${secEle[0]}"></a>\n### ${secEle[0]}\n\n${secEle[1]}`
    }, `${title[1]}  \n\n## ${toc[0]}  \n${toc[1]}\n\n`);
    return reduced;
}

const helpMenus = () => {
    console.log(menus.help);
}


const commandMain = () => {
    console.log(menus.base);
    inquirer
        .prompt([{
            type: 'input',
            name: 'command',
            message: 'Enter command: '
        }]).then((data) => {
            const dataArr = data.command.split(" ");
            switch(dataArr[0].toLowerCase()) {
                case 'exit':
                    process.exit(0);
                break;
                case 'new':
                    newReadme(readmeJSON);
                break;
                case 'preview':
                    const array = Object.entries(readmeJSON);
                    const preview = previewReadme(array[0], array[1], array.splice(2, array.length - 2));
                    console.log(`\n\n${preview}`);
                    commandMain();
                break;
                case 'help':
                    helpMenus();
                    commandMain();
                break;
                case 'modify':
                    commandModify();
                break;
                case 'save':
                    const contentArr = Object.entries(readmeJSON);
                    const content = previewReadme(contentArr[0], contentArr[1], contentArr.splice(2, contentArr.length - 2));
                    saveFile(content);
                break;
                case 'modify':
                    commandClear(dataArr[0]);
                break;
                default:
                    console.log("Invalid command.")
                    commandMain();
            }
        }).catch((err) => {
            console.log(err);
        })
}

const commandModify = () => {
    console.log(menus.base);
    const array = Object.entries(readmeJSON);
    const list = array.splice(2, array.length - 2).map(x => x[0]);
    inquirer
        .prompt([{
            type: 'list',
            name: 'command',
            message: 'Modify: ',
            choices: list,
            pageSize: 8
        }]).then((data) => {
            console.log(`#${data.command}`)
            addPartPrompt(data.command);
        }).catch((err) => {
            console.log(err);
        })
}

const addPartPrompt = (section) => {
    if(section === "License") {
        const licenseArray = [];
        const licenseFolder = './licenses/'
        fs.readdir(licenseFolder, (err, files) => {
            files.forEach(file => licenseArray.push(file));
            inquirer
                .prompt([{
                    type: 'list',
                    name: 'license',
                    message: 'Select a license',
                    choices: licenseArray,
                    pages: 8
                }]).then((data) => {
                    fs.readFile(`${licenseFolder}${data.license}`, 'utf-8', ((err, data) => {
                        if (err) console.log(err);
                        else readmeJSON["License"] = `${data}  \n`;
                    }))
                    fs.copyFile(`${licenseFolder}${data.license}`, `LICENSE`, ((err) => {
                        if (err) console.log(err);
                        else console.log(`${data.license} chosen!`);
                        commandMain();
                    }))

                })
        });
        

    } else {
    inquirer
        .prompt([{
            type: 'list',
            name: 'another',
            message: 'Add another part?',
            choices: ["Yes", "No"]
        }]).then((data) => {
            if (data.another === "No") commandMain();
            else {
                inquirer
                    .prompt([{
                        type: 'list',
                        name: 'part',
                        message: 'Choose part to add.',
                        choices:["Paragraph","Link","Image"]
                    }]).then((data) => {
                        part2add(data.part, section)
                        })
            } 
        }).catch((err) => {
            console.log(err);
        })
}}

const part2add = (part, section) => {
    switch (part) {
        case "Paragraph":
            inquirer
                .prompt([{
                    type: 'input',
                    name: 'part',
                    message: 'New Paragraph',
                }]).then((data) => {
                    addPart(data.part, section)
                    })
        break;
        case "Link":
            inquirer
                .prompt([{
                    type: 'input',
                    name: 'alt',
                    message: '[Alt]: ',
                }]).then((data) => {
                    const alt = data.alt;
                    inquirer
                        .prompt([{
                            type: 'input',
                            name: 'url',
                            message: '(Source): ',
                        }]).then((data) => {
                                addPart(`[${alt}](${data.url})`, section)
                            })

                        })
        break;
        case "Image":
            const pictureArray = [];
            const pictureFolder = './images/'
            fs.readdir(pictureFolder, (err, files) => {
                files.forEach(file => pictureArray.push(file));
                inquirer
                .prompt([{
                    type: 'input',
                    name: 'alt',
                    message: '[Alt]: ',
                }]).then((data) => {
                    const alt = data.alt;
                    inquirer
                        .prompt([{
                            type: 'list',
                            name: 'picture',
                            message: 'Select a picture:',
                            choices: pictureArray,
                            pages: 8
                        }]).then((data) => {
                            addPart(`![${alt}](${pictureFolder}${data.picture})`, section)
                        })})
            });
        break;
}}


const addPart = (part, section) => {
    console.log(part);
    console.log(section)
    if (part === "Paragraph") readmeJSON[section] = `${readmeJSON[section]}${part}\n  \n`
    else readmeJSON[section] = `${readmeJSON[section]}${part}\n`
    const array = Object.entries(readmeJSON);
    const preview = previewReadme(array[0], array[1], array.splice(2, array.length - 2));
    console.log(`\n\n${preview}`);
    addPartPrompt(section);

}

const saveFile = (content) => {
    fs.writeFile('README.md', content, function (err) {
        if (err) throw err;
        console.log('Saved!');
        commandMain();
      });
}

const commandClear = () => {
    console.log(menus.base);
    const array = Object.entries(readmeJSON);
    const list = array.splice(2, array.length - 2).map(x => x[0]);
    inquirer
        .prompt([{
            type: 'list',
            name: 'command',
            message: 'Clear: ',
            choices: list,
            pageSize: 8
        }]).then((data) => {
            console.log(`#${data.command} cleared!`)
            readmeJSON[data.command] = "";
            commandMain();
        }).catch((err) => {
            console.log(err);
        })
}

commandMain();