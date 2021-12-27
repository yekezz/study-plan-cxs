
interface Rule {
  rule: boolean,
  handle: Function,
  name?: string
}

export default class {
  public rules!: Rule[];

  constructor() {
    this.rules = [];
  }

  public addRule(rule: Rule) {
    if(this.rules.indexOf(rule)  === -1 && !this.rules.find(i => i.name === rule.name)) {
      this.rules.push(rule);
    }
  }

  public addRules(rules: Rule[]) {
    this.rules = this.rules.concat(rules);
  }

  public remove(name: string) {
    if(!name) {
      return;
    }
    const index = this.rules.findIndex(i => i.name === name);
    this.rules.splice(index, 1);
  }

  public clean() {
    this.rules = [];
  }

  public check() {
    for(let i = 0; i<this.rules.length;i++) {
      if(!this.rules[i].rule) {
        this.rules[i].handle();
        return false;
      }
    }
    return true;
  }
};