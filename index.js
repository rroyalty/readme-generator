const inquirer = require('inquirer');
const fs = require('fs');
const menus = require('./menus.json');

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
                type: 'checkbox',
                message: 'What sections would you like to include in your ReadMe?',
                name: 'sections',
                pageSize: 8,
                choices: ['#Description', '#Installation', '#Usage', '#License', '#Contributing', '#Tests', '#Questions']
            }
        ]).then((data) => {
            readmeJSON["###Title"] = `###${data.title}`;
            readmeJSON["##Table of Contents"] = "";
            data.sections.forEach((ele) => {
                readmeJSON["##Table of Contents"] = `${readmeJSON["##Table of Contents"]}\n[${ele}](${ele})`;
                readmeJSON[ele] = "";
            })
            commandMain();
        }).catch((err) => {
            console.log(err);
        })
}

const previewReadme = (title, toc, sections) => {
    const reduced = sections.reduce((accumulator, secEle) => { 
        return `${accumulator}---\n<a name="${secEle[0]}"/>\n${secEle[0]}\n\n${secEle[1]}`
    }, `${title[1]}\n---\n${toc[0]}\n${toc[1]}\n`);
    return reduced;
}

const helpMenus = (parameter) => {
    switch(!parameter === false) {
        case true:
            try {
                if (!menus[parameter.toLowerCase()] === false) console.log(menus[parameter.toLowerCase()]);
                else  {
                    console.log("Not a valid help command\n")
                    console.log(menus.help)
                }
            } catch {(err) => {
                console.log(err)
                console.log(menus.help)
                };
            }
        break;
        default:
            console.log(menus.help);
    }
}

const modifyParts = (parameter) => {
    switch(!parameter === false) {
        case true:
            try {
                if (!menus[parameter.toLowerCase()] === false) console.log(menus[parameter.toLowerCase()]);
                else  {
                    console.log("Not a modifiable part\n")
                    console.log(`#${parameter}`)
                }
            } catch {(err) => {
                console.log(err)
                };
            }
        break;
        default:
            console.log(menus[parameter]);
    }
}

const commandMain = () => {
    console.log(menus.base);
    inquirer
        .prompt([{
            type: 'input',
            name: 'command',
            message: 'Enter command: '
        }]).then((data) => {
            const dataArr = data.command.split(" ")
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
                    helpMenus(dataArr[1]);
                    commandMain();
                break;
                case 'modify':
                    modifyParts(dataArr[1]);
                    commandModify();
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
    const list = array.splice(1, array.length - 1).map(x => x[0]);
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
}

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
                    message: '[Site Name]: ',
                }]).then((data) => {
                    const alt = data.alt;
                    inquirer
                    .prompt([{
                        type: 'input',
                        name: 'url',
                        message: '(URL): ',
                    }]).then((data, url) => {
                            addPart(`[${alt}](${data.url})`, section)
                        })

                    })
        break;
        case "Image":
            inquirer
                .prompt([{
                    type: 'input',
                    name: 'alt',
                    message: '![Alt Text]: ',
                }]).then((data) => {
                    const alt = data.alt;
                    inquirer
                    .prompt([{
                        type: 'input',
                        name: 'url',
                        message: '(Image Source): ',
                    }]).then((data, url) => {
                            addPart(`![${alt}](${data.url})`, section)
                        })
                    })
        break;
    }
}

const addPart = (part, section) => {

    if (part === "Paragraph") readmeJSON[section] = `${readmeJSON[section]}${part}\n\n`
    else readmeJSON[section] = readmeJSON[section] = `${readmeJSON[section]}${part}\n`
    const array = Object.entries(readmeJSON);
    const preview = previewReadme(array[0], array.splice(1, array.length - 1));
    console.log(`\n\n${preview}`);
    addPartPrompt(section);

}

commandMain();