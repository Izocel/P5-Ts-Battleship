export default class GameConsole {
    parent;
    pre;
    code;
    following: boolean = true;

    constructor(parentId, follow: boolean = true) {
        this.parent = parentId
            ? document.getElementById(parentId)
            : document;

        this.following = follow,
            this.pre = document.createElement('pre'),
            this.code = document.createElement('code');

        this.pre.appendChild(this.code);
        this.pre.classList.add("scrollbar");
        document.getElementById("gameConsole").appendChild(this.pre);
    }

    public log: Function = v => this.print('log', v);
    public succes: Function = v => this.print('succes', v);
    public warn: Function = v => this.print('warn', v);
    public danger: Function = v => this.print('danger', v);


    public clear() {
        while (this.code.hasChildNodes()) {
            this.code.removeChild(this.code.lastChild);
        }
    }

    public toggleFollow() {
        this.following = !this.following;
    }

    public scrollToBottom() {
        this.pre.scrollTo(0, Number.MAX_SAFE_INTEGER);
    }

    private print(className, object) {
        const playername = "Username";
        const now = new Date().toLocaleTimeString();
        var s = (typeof object === 'string')
            ? `[${now}] ${playername}: ${object}`
            : `[${now}] ${playername}-: ${JSON.stringify(object)}`,

            span = document.createElement('span'),
            text = document.createTextNode(s + '\n');

        span.setAttribute('class', className);
        span.appendChild(text);
        this.code.appendChild(span);

        if (this.following) {
            this.scrollToBottom();
        }
    }
}