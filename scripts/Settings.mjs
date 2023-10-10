import * as fs from 'fs';
export class Settings {
    settingsFilePath = '';
    settingsFileContent = '';
    config = {};
    
    constructor(settingsFilePath) {
        this.settingsFilePath = settingsFilePath;
        this.settingsFileContent = fs.readFileSync(this.settingsFilePath);
        this.config = JSON.parse(this.settingsFileContent);

        fs.watchFile(this.settingsFilePath, (curr, prev) => {
            this.settingsFileContent = fs.readFileSync(this.settingsFilePath);
            this.config = JSON.parse(this.settingsFileContent);
        });
    }
};
