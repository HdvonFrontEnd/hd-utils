import { SimulationNodeDatum, SimulationLinkDatum } from 'd3'
import { Application } from 'pixi.js'

export interface App extends Application {
  [field: string]: any;
}

export interface AppParams {
  width?: number;
  height?: number;
  autoResize?: boolean;
  antialias?: boolean;
  transparent?: boolean;
  resolution?: number;
  [field: string]: number | string | boolean | undefined;
}

export interface NodeDatum extends SimulationNodeDatum {
  id?: number | string;
  name?: number | string;
  [field: string]: number | string | boolean | undefined | null;
}

export interface EdgeDatum extends SimulationLinkDatum<NodeDatum> {
  source: NodeDatum;
  target: NodeDatum;
  path?: [number, number, number, number, number, number, number, number];
  [field: string]: any;
}

export interface SimulationDatum {
  nodes: NodeDatum[];
  edges: EdgeDatum[];
  [field: string]: any;
}
