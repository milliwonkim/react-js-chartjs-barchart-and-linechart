/**
 * 현재는 일 별로 => Jan, Feb, Mar 로 바꾸기
 *
 *
 *
 */

import React, { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js'
import * as d3 from 'd3'
import axios from 'axios'
import './App.css'

function App() {
    const canvasRef = useRef()

    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    const handleChangeOfStart = (e) => {
        setStart(e.target.value)
        console.log('start: ', start)
    }

    const handleChangeOfEnd = (e) => {
        setEnd(e.target.value)
        console.log('end: ', end)
    }

    useEffect(() => {
        axios({
            method: 'GET',
            url:
                'https://nmsvtx50zd.execute-api.ap-northeast-2.amazonaws.com/recruit/order',
            params: {
                start_date_id: start,
                end_date_id: end,
                freq: 'monthly',
                measures: 'sales,order_cnt',
            },
        }).then((data) => {
            console.log('Entire Data: ', data)

            let temp = []

            data.data.data.measures[0].map((d) => {
                temp.push(d.toLocaleString())
            })

            // --------------------------
            const ctx = canvasRef.current.getContext('2d')

            new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [
                        {
                            label: 'Bar Dataset',
                            yAxisID: 'A',
                            data: data.data.data.measures[0],
                            // this dataset is drawn below
                            order: 1,
                            backgroundColor: '#74b9ff',
                        },
                        {
                            label: 'Line Dataset',
                            yAxisID: 'B',
                            data: data.data.data.measures[1],
                            type: 'line',
                            // this dataset is drawn on top
                            order: 2,
                            fill: false,
                            borderColor: '#81ecec',
                        },
                    ],
                    labels: data.data.index,
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                id: 'A',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    callback: function (value) {
                                        return value / 1000000 + 'M'
                                    },
                                },
                            },
                            {
                                id: 'B',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    max: d3.max(data.data.data.measures[1]),
                                    min: d3.min(data.data.data.measures[1]),
                                },
                            },
                        ],
                    },
                },
            })
        })
    }, [start, end])

    return (
        <div className="App">
            <h1>Bar Chart and Line Chart</h1>
            <label>
                START
                <input onChange={handleChangeOfStart} />
            </label>
            <label>
                END
                <input onChange={handleChangeOfEnd} />
            </label>
            <canvas height="400" width="400" ref={canvasRef} />
        </div>
    )
}

export default App
