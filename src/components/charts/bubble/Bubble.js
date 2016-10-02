/*
 * This file is part of the nivo project.
 *
 * (c) 2016 Raphaël Benitte
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict'

import React, { Component }                    from 'react'
import _                                       from 'lodash'
import { convertLabel }                        from '../../../lib/propertiesConverters'
import { bubblePropTypes, bubbleDefaultProps } from './BubbleProps'
import BubblePlaceholders                      from './BubblePlaceholders'
import { getColorGenerator }                   from '../../../ColorUtils'


const createNodes = ({
    borderWidth, borderColor,
    enableLabel,
    label: _label,
    labelFormat,
    labelSkipRadius,
    labelTextColor,
    labelTextDY,
}) => {
    const label         = convertLabel(_label, labelFormat)
    const borderColorFn = getColorGenerator(borderColor)
    const textColorFn   = getColorGenerator(labelTextColor)
    
    return nodes => {
        const renderedNodes = []

        nodes
            .filter(node => node.style.r > 0)
            .forEach(node => {
                renderedNodes.push(
                    <circle
                        key={`${node.key}.circle`}
                        r={node.style.r}
                        className="nivo_bubble_node"
                        transform={`translate(${node.style.x},${node.style.y})`}
                        style={{
                            fill:        node.style.color,
                            stroke:      borderColorFn(node.style),
                            strokeWidth: borderWidth,
                        }}
                    />
                )
            })

        if (enableLabel === true) {
            nodes
                .filter(node => {
                    return node.data.height === 0 && (labelSkipRadius === 0 || node.data.r >= labelSkipRadius)
                })
                .forEach(node => {
                    renderedNodes.push(
                        <text
                            key={`${node.key}.text`}
                            className="nivo_bubble_legend"
                            transform={`translate(${node.style.x},${node.style.y})`}
                            textAnchor={'middle'}
                            dy={labelTextDY}
                            style={{
                                fill: textColorFn(node.style),
                            }}
                        >
                            {label(node.data.data)}
                        </text>
                    )
                })
        }

        return renderedNodes
    }
}


class Bubble extends Component {
    render() {
        return (
            <BubblePlaceholders
                {...this.props}
                namespace="svg"
            >
                {createNodes(this.props)}
            </BubblePlaceholders>
        )
    }
}

Bubble.propTypes = _.omit(bubblePropTypes, [
    'children',
    'namespace',
    'transitionDuration',
    'transitionEasing',
])

Bubble.defaultProps = _.omit(bubbleDefaultProps, [
    'namespace',
    'transitionDuration',
    'transitionEasing',
])


export default Bubble
