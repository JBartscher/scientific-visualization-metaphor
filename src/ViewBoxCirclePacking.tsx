import {Suspense, useEffect, useRef, useState} from "react";
import {
  select,
  pack as d3pack,
  hierarchy,
  HierarchyNode,
  scaleLinear,
  interpolateHcl,
  HierarchyCircularNode,
  interpolateZoom
} from "d3"

import {initializeApp} from 'firebase/app'
import {getFirestore, collection, query} from 'firebase/firestore';
import {useFirestoreQueryData} from "@react-query-firebase/firestore";

const Loading = () => <p>Loading ...</p>;

const width = 500
const height = 500
let view: [number, number, number];

const test_data = {
  "children": [
    {
      "name": "analytics",
      "children": [
        {
          "name": "cluster",
          "children": [
            {
              "name": "AgglomerativeCluster",
              "value": 3938
            },
            {
              "name": "CommunityStructure",
              "value": 3812
            },
            {
              "name": "HierarchicalCluster",
              "value": 6714
            },
            {
              "name": "MergeEdge",
              "value": 743
            }
          ]
        },
        {
          "name": "graph",
          "children": [
            {
              "name": "BetweennessCentrality",
              "value": 3534
            },
            {
              "name": "LinkDistance",
              "value": 5731
            },
            {
              "name": "MaxFlowMinCut",
              "value": 7840
            },
            {
              "name": "ShortestPaths",
              "value": 5914
            },
            {
              "name": "SpanningTree",
              "value": 3416
            }
          ]
        },
        {
          "name": "optimization",
          "children": [
            {
              "name": "AspectRatioBanker",
              "value": 7074
            }
          ]
        }
      ]
    },
    {
      "name": "data",
      "children": [
        {
          "name": "converters",
          "children": [
            {
              "name": "Converters",
              "value": 721
            },
            {
              "name": "DelimitedTextConverter",
              "value": 4294
            },
            {
              "name": "GraphMLConverter",
              "value": 9800
            },
            {
              "name": "IDataConverter",
              "value": 1314
            },
            {
              "name": "JSONConverter",
              "value": 2220
            }
          ]
        },
        {
          "name": "DataField",
          "value": 1759
        },
        {
          "name": "DataSchema",
          "value": 2165
        },
        {
          "name": "DataSet",
          "value": 586
        },
        {
          "name": "DataSource",
          "value": 3331
        },
        {
          "name": "DataTable",
          "value": 772
        },
        {
          "name": "DataUtil",
          "value": 3322
        }
      ]
    },
    {
      "name": "display",
      "children": [
        {
          "name": "DirtySprite",
          "value": 8833
        },
        {
          "name": "LineSprite",
          "value": 1732
        },
        {
          "name": "RectSprite",
          "value": 3623
        },
        {
          "name": "TextSprite",
          "value": 10066
        }
      ]
    },
    {
      "name": "flex",
      "children": [
        {
          "name": "FlareVis",
          "value": 4116
        }
      ]
    },
    {
      "name": "physics",
      "children": [
        {
          "name": "DragForce",
          "value": 1082
        },
        {
          "name": "GravityForce",
          "value": 1336
        },
        {
          "name": "IForce",
          "value": 319
        },
        {
          "name": "NBodyForce",
          "value": 10498
        },
        {
          "name": "Particle",
          "value": 2822
        },
        {
          "name": "Simulation",
          "value": 9983
        },
        {
          "name": "Spring",
          "value": 2213
        },
        {
          "name": "SpringForce",
          "value": 1681
        }
      ]
    },
  ]
}


const pack = (data: any) => d3pack()
  .size([width, height])
  .padding(3)
  (hierarchy(data)
    .sum(d => d.value)
    // @ts-ignore
    .sort((a: HierarchyNode<number>, b: HierarchyNode<number>) => b.value - a.value))

const color = scaleLinear()
  .domain([0, 5])
  //@ts-ignore
  .range(["hsl(195,61%,50%)", "hsl(348,67%,42%)"])
  //@ts-ignore
  .interpolate(interpolateHcl)

const ViewBox = () => {

  const firebase = initializeApp({
    apiKey: "AIzaSyDvlluxUwyM5EtYMrw8R95-xh3EmdIh-jk",
    authDomain: "journal-bibtext-metadata.firebaseapp.com",
    projectId: "journal-bibtext-metadata",
    storageBucket: "journal-bibtext-metadata.appspot.com",
    messagingSenderId: "744308851005",
    appId: "1:744308851005:web:14a1c4b15048854ec38554"
  })
  const firestore = getFirestore(firebase);

  const ref = query(collection(firestore, "journal-publications"));

  type Publication = {
      decade: number,
      year: number,
      journal: string
      link: string
  }

  // @ts-ignore
  const myQuery = useFirestoreQueryData<Publication>(["journal-publications"], ref);

  if (myQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // @ts-ignore
  return myQuery.data.map((document:Publication) => {
    return <div key={document.journal}>{document.journal} - {document.link} - {document.decade} - {document.year}</div>;
  });

  const [data, setData] = useState<HierarchyCircularNode<unknown>>(pack(test_data))
  // const [data, setData] = useState([4, 1, 32, 21, 23, 5])

  const svgRef = useRef<SVGSVGElement>(null)

  let focus: HierarchyCircularNode<unknown> | undefined = data;

  useEffect(() => {

    const svg = select(svgRef.current)
    svg.attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", color(0))
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, data));
    console.log(svg)

    const node = svg.append("g")
      .selectAll("circle")
      .data(data.descendants().slice(1))
      .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("pointer-events", d => !d.children ? "none" : null)
      .on("mouseover", function () {
        select(this).attr("stroke", "#000");
        select(this).attr("stroke-width", "2px");
      })
      .on("mouseout", function () {
        select(this).attr("stroke", null);
      })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

    const label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(data.descendants())
      .join("text")
      .style("fill-opacity", d => d.parent === data ? 1 : 0)
      .style("display", d => d.parent === data ? "inline" : "none")
      // @ts-ignore
      .text(d => d.data.name);

    zoomTo([data.x, data.y, data.r * 2]); // initial whole view

    function zoomTo(v: [number, number, number]) {
      const k = width / v[2];

      view = v;

      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }

    function zoom(event: { altKey: any; }, d: HierarchyCircularNode<unknown> | undefined) {
      const focus0 = focus;

      focus = d;

      const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          // @ts-ignore
          const i = interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          // @ts-ignore
          return d.parent === focus || this.style.display === "inline";
        })
        // @ts-ignore
        .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function (d) {
          // @ts-ignore
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          // @ts-ignore
          if (d.parent !== focus) this.style.display = "none";
        });
    }

  }, [test_data])

  return (
    <div className={"bg-gray-300 view-box"}>
      <svg className={"bg-red-200"} ref={svgRef} width='500' height='500' viewBox="0 0 300 300">
      </svg>
    </div>
  )

}


const Wrapper = () => (
  <Suspense fallback={<Loading/>}>
    <h1>Viewbox</h1>
    <ViewBox/>
  </Suspense>
);

export default Wrapper
