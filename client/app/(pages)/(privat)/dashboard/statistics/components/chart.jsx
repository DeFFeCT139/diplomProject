'use client'
import { Column } from '@ant-design/plots';



export default function Chart({width, height, data}) {
  
  const config = {
    data,
    xField: 'letter',
    yField: 'frequency',
    onReady: ({ chart }) => {
      try {
        const { height } = chart._container.getBoundingClientRect();
        const tooltipItem = data[Math.floor(Math.random() * data.length)];
        chart.on(
          'afterrender',
          () => {
            chart.emit('tooltip:show', {
              data: {
                data: tooltipItem,
              },
              offsetY: height / 2 - 0,
            });
          },
          true,
        );
      } catch (e) {
        console.error(e);
      }
    },
  };
  return <Column width={width} height={height} {...config} />;
};