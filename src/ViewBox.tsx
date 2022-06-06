import {Suspense, useEffect, useRef, useState} from "react";
import {select, selectAll} from "d3"

const Loading = () => <p>Loading ...</p>;


const ViewBox = () => {

  const [data, setData] = useState([4, 1, 32, 21, 23, 5])

  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = select(svgRef.current)
    console.log(svg)
    svg
      .selectAll("circle")
      .data(data)
      .join(
        enter => enter.append("circle").attr("class", "new"),
        update => update.attr("class", "updated"),
        exit => exit.remove()
      )
      .attr("r", value => value)
      .attr("cx", value => value * 2)
      .attr("cy", value => value * 2)
      .attr("stroke", "red")
      .attr("stroke-width", "1")
      .attr("fill", "red")
  }, [data])


  return (
    <div className={"bg-gray-300 view-box"}>
      <svg className={"bg-red-200"} ref={svgRef} width='500' height='500'  viewBox="0 0 300 300">
        <rect height="20" width="20" y="107" x="107" />
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
