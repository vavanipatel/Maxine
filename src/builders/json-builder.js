const { properties } = require('../util/propertyReader/property-reader');
class JsonBuilder{
    jsonObj;
    doCheckCondition;
    registeredObj;
    conditionStack = [];

    constructor(jsonObj){
        this.jsonObj = jsonObj;
    }

    static createNewJson = () => new JsonBuilder({});

    static loadJson = (jsonObj) => new JsonBuilder(jsonObj);

    checkCondition = (condition) => {
        this.conditionStack.push(condition);
        this.doCheckCondition = true;
        return this;
    }

    checkNull = (element) => {
        return this.checkCondition(element !== null);
    }

    endCondition = () => {
        this.conditionStack.pop();
        if(this.conditionStack.length === 0){
            this.doCheckCondition = null;
        }
        return this;
    }

    endAllConditions = () => {
        this.conditionStack = [];
        this.doCheckCondition = null;
        return this
    }

    put = (key, value) => {
        if(this.doCheckCondition){
            if(this.conditionStack.every(e => e === true)){
                this.jsonObj[key] = value;
            }
            return this;
        }
        this.jsonObj[key] = value;
        return this;
    };

    registerObj = (obj) => {
        this.registeredObj = obj;
        return this;
    }

    putFromRegObj = (refObj, key = refObj) => {
        if(this.doCheckCondition){
            if(this.conditionStack.slice(-1)[0]){
                this.jsonObj[key] = this.registeredObj[refObj];
            }
            return this;
        }
        this.jsonObj[key] = this.registeredObj[refObj];
        return this;
    };

    deregisterObj = () => {
        this.registeredObj = null;
        return this;
    }

    getJson = () => this.jsonObj;

    formatJson = () => {
      return properties["log.json.prettify"] === 'true' ? this.prettifyJSON() : this.minifyJSON();
    }

    prettifyJSON = () => {
        this.jsonObj = JSON.stringify(this.jsonObj, null, "  ");
        return this;
    }

    minifyJSON = () => {
        this.jsonObj = JSON.stringify(JSON.parse(JSON.stringify(this.jsonObj)));
        return this;
    }

}

module.exports = JsonBuilder;