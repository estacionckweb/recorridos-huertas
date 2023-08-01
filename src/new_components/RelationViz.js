import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3'

import img from '../../src/assets/title.png'
import img2 from '../../src/assets/title-02.png'
import img3 from '../../src/assets/title-03.png'

const RelationViz = props => {
    const d3_canvas = useRef(null)
    const { data } = props

    const width = 500,
        height = 500

    // given an angle in degrees return the coordinates of a point on the circle of radius r
    function getPoint(angle, r) {
        return [r * Math.cos(angle), r * Math.sin(angle)]
    }



    useEffect(() => {
        const svg = d3.select(d3_canvas.current)
            .attr("viewBox", [0, 0, width, height])

        svg.selectAll("*").remove()

        const burbujas = svg.selectAll(".burbujas")
            .data(data)
            .join("g")
            .attr("class", "burbujas")

        const simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(d => {
                return width / 2
            }))
            .force("y", d3.forceY(d => {
                return height / 2
            }))
            .force("distancia", d3.forceCollide((d, i) => {
                return 27
            }).iterations(2))
            .on("tick", () => {
                burbujas.attr("transform", d => `translate(${d.x} ${d.y})`)
            })

        burbujas.append("circle")
            .attr("r", (d, i) => {
                return 25
            })
            .attr("fill", 'rgba(0,0,0,0.4)')

        // append an image to burbujas
        burbujas.append("image")
            .attr("xlink:href", (d) => {
                if (d.icon === '01') return img2
                if (d.icon === '02') return img3
                return img
            })
            .attr("x", -10)
            .attr("y", -10)
            .attr('filter', 'saturate(0%)')
            .attr("width", 20)
            .attr("height", 20)

        for (let i = 0; i < 5; i++) {
            burbujas.append("text")
                .attr("x", getPoint((Math.PI * 2 / 5) * i, 17)[0])
                .attr("y", getPoint((Math.PI * 2 / 5) * i, 17)[1])
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", 10)
                .attr("class", "emoji")
                .attr("fill", 'white')
                .attr('filter', d => {
                    if(props.filters['Emoji']) {
                        if(props.filters['Emoji'] === d.properties['emoji_' + (i + 1)]) {
                            return 'saturate(100%)'
                        }
                    }
                    return 'saturate(0%)'
                })
                .text(d => d.properties['emoji_' + (i + 1)])
        }

        burbujas.on("mouseover", function (d, i) {
            d3.select(this).selectAll(".emoji").attr('filter', 'saturate(100%)')
            d3.select(this).selectAll("image").attr('filter', 'saturate(100%)')
            props.setSelected(i.id)
        }).on("mouseleave", function (d) {
            d3.select(this).selectAll(".emoji").attr('filter', (d,i) => {
                if(props.filters['Emoji']) {
                    if(props.filters['Emoji'] === d.properties['emoji_' + (i + 1)]) {
                        return 'saturate(100%)'
                    }
                }
                return 'saturate(0%)'
            })
            d3.select(this).selectAll("image").attr('filter', 'saturate(0%)')
            props.setSelected(null)
        })


    }, [props.data])

    return (
        <div className={props.className}>
            <svg ref={d3_canvas}></svg>
        </div>
    )
}

export default RelationViz;