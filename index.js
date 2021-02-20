const inquirer = require('inquirer');
const fs = require('fs');
let readmeJSON = {};
const openMenu = 
`WELCOME TO RYAN'S README BUILDER!
    
New - Create new readme file.
Preview - Previews file that you're working on in Terminal.
Preview <section> - Previews the section of the file you're working on.
Modify <section> - Modifies a specific section of the ReadMe.
Clear <section> - Clears the section.
Save - Saves the read me file.
Help - Displays current commands.

`;

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
                choices: ['Description', 'Table of Contents', 'Installation', 'Usage', 'License', 'Contributing', 'Tests', 'Questions']
            }
        ]).then((data) => {
            readmeJSON["Title"] = data.title;
            data.sections.forEach((ele) => readmeJSON[ele] = "");
            commandMain();
        }).catch((err) => {
            console.log(err);
            commandMain();
        })
}

const previewReadme = (title, sections) => {
    const reduced = sections.reduce((accumulator, secEle) => { 
        return `${accumulator}\n#${secEle[0]}\n${secEle[1]}`
    }, `##${title[1]}\n`);
    return reduced;
}

const commandMain = () => {
    console.log(openMenu);
    inquirer
        .prompt([{
            type: 'input',
            name: 'command',
            message: 'Enter command: '
        }]).then((data) => {
            console.log(data.command)
            const dataArr = data.command.split(" ")
        
            console.log(dataArr);

            switch(dataArr[0]) {
                case 'New' || 'NEW' || 'new':
                    newReadme(readmeJSON);
                break;
                case 'Preview' || 'PREVIEW' || 'preview':
                    const array = Object.entries(readmeJSON);
                    const preview = previewReadme(array[0], array.splice(1, array.length - 1))
                    console.log(`\n\n${preview}`)
                break;
                default:
                    commandMain();
            }
        }).catch((err) => {
            console.log(err);
            commandMain();
        })
}

commandMain();