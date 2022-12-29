import p5 from "p5";

export default class MyVect extends p5.Vector {
	public orientation?: string;
	public fillColor?:string;
	public strokeColor?:string;
	public isMouseHover?:boolean;
}