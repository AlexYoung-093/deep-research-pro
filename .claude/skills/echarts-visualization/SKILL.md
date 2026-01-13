---
name: echarts-visualization
description: 使用 ECharts 5.x 创建专业的数据可视化图表
version: 1.0.0
author: Deep Research Pro Team
tags:
  - echarts
  - charts
  - visualization
  - data
---

# ECharts Visualization Skill

## 概述

本技能帮助创建专业的 ECharts 数据可视化图表，配色采用苹果风格的中性色调。

## 配色方案

### 主题配色

```javascript
// 苹果风格中性色板
const APPLE_COLORS = {
  // 主色系 - 中性灰
  primary: ['#1d1d1f', '#636366', '#86868b', '#aeaeb2', '#c7c7cc', '#d1d1d6'],
  
  // 强调色 - 谨慎使用
  accent: {
    blue: '#007aff',
    green: '#34c759',
    orange: '#ff9f0a',
    red: '#ff3b30',
    purple: '#af52de',
    teal: '#5ac8fa'
  },
  
  // 背景色
  background: {
    light: '#ffffff',
    lightGray: '#f5f5f7',
    dark: '#1c1c1e'
  }
};

// ECharts 颜色序列
const chartColors = [
  '#1d1d1f',  // 深灰黑
  '#636366',  // 中灰
  '#007aff',  // 苹果蓝
  '#34c759',  // 苹果绿
  '#ff9f0a',  // 苹果橙
  '#86868b',  // 浅灰
];
```

## 图表模板

### 柱状图 (Bar Chart)

```javascript
const barChartOption = {
  title: {
    text: '市场份额对比',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#1d1d1f',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8e8ed',
    borderWidth: 1,
    textStyle: {
      color: '#1d1d1f'
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(0,0,0,0.05)'
      }
    }
  },
  legend: {
    bottom: 20,
    textStyle: {
      color: '#86868b',
      fontSize: 12
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['产品A', '产品B', '产品C', '产品D'],
    axisLine: {
      lineStyle: {
        color: '#d2d2d7'
      }
    },
    axisLabel: {
      color: '#86868b',
      fontSize: 12
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    name: '份额 (%)',
    nameTextStyle: {
      color: '#86868b',
      fontSize: 12,
      padding: [0, 40, 0, 0]
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#f0f0f5',
        type: 'dashed'
      }
    },
    axisLabel: {
      color: '#86868b',
      fontSize: 12
    }
  },
  series: [
    {
      name: '2024年',
      type: 'bar',
      data: [35, 28, 22, 15],
      itemStyle: {
        color: '#1d1d1f',
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '40%',
      emphasis: {
        itemStyle: {
          color: '#636366'
        }
      }
    }
  ]
};
```

### 折线图 (Line Chart)

```javascript
const lineChartOption = {
  title: {
    text: '增长趋势分析',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#1d1d1f'
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8e8ed',
    textStyle: {
      color: '#1d1d1f'
    }
  },
  legend: {
    bottom: 20,
    textStyle: {
      color: '#86868b'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#d2d2d7'
      }
    },
    axisLabel: {
      color: '#86868b'
    }
  },
  yAxis: {
    type: 'value',
    name: '亿美元',
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#f0f0f5',
        type: 'dashed'
      }
    },
    axisLabel: {
      color: '#86868b'
    }
  },
  series: [
    {
      name: '市场规模',
      type: 'line',
      data: [100, 150, 220, 350, 500, 720],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: '#1d1d1f'
      },
      itemStyle: {
        color: '#1d1d1f',
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(29,29,31,0.15)' },
            { offset: 1, color: 'rgba(29,29,31,0.02)' }
          ]
        }
      }
    }
  ]
};
```

### 饼图 (Pie Chart)

```javascript
const pieChartOption = {
  title: {
    text: '市场份额分布',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#1d1d1f'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8e8ed',
    textStyle: {
      color: '#1d1d1f'
    },
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    bottom: 20,
    textStyle: {
      color: '#86868b'
    }
  },
  series: [
    {
      name: '市场份额',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#1d1d1f',
        fontSize: 12,
        formatter: '{b}\n{d}%'
      },
      labelLine: {
        lineStyle: {
          color: '#d2d2d7'
        }
      },
      data: [
        { value: 35, name: '企业A', itemStyle: { color: '#1d1d1f' } },
        { value: 28, name: '企业B', itemStyle: { color: '#636366' } },
        { value: 22, name: '企业C', itemStyle: { color: '#86868b' } },
        { value: 15, name: '其他', itemStyle: { color: '#aeaeb2' } }
      ]
    }
  ]
};
```

### 雷达图 (Radar Chart)

```javascript
const radarChartOption = {
  title: {
    text: '竞品能力对比',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#1d1d1f'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8e8ed',
    textStyle: {
      color: '#1d1d1f'
    }
  },
  legend: {
    bottom: 20,
    textStyle: {
      color: '#86868b'
    }
  },
  radar: {
    indicator: [
      { name: '性能', max: 100 },
      { name: '价格', max: 100 },
      { name: '服务', max: 100 },
      { name: '品牌', max: 100 },
      { name: '创新', max: 100 }
    ],
    center: ['50%', '55%'],
    radius: '60%',
    axisName: {
      color: '#86868b',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#f0f0f5'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(245,245,247,0.3)', 'rgba(245,245,247,0.1)']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#e8e8ed'
      }
    }
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [85, 70, 90, 80, 75],
          name: '产品A',
          lineStyle: { color: '#1d1d1f', width: 2 },
          itemStyle: { color: '#1d1d1f' },
          areaStyle: { color: 'rgba(29,29,31,0.2)' }
        },
        {
          value: [70, 85, 75, 90, 60],
          name: '产品B',
          lineStyle: { color: '#007aff', width: 2 },
          itemStyle: { color: '#007aff' },
          areaStyle: { color: 'rgba(0,122,255,0.2)' }
        }
      ]
    }
  ]
};
```

## React 集成

### ECharts React 组件

```tsx
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  option: echarts.EChartsOption;
  className?: string;
  style?: React.CSSProperties;
}

export function Chart({ option, className, style }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(option);

      const handleResize = () => {
        chartInstance.current?.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [option]);

  return (
    <div 
      ref={chartRef} 
      className={className}
      style={{ width: '100%', height: '400px', ...style }} 
    />
  );
}
```

### 暗色模式适配

```javascript
// 暗色模式配色
const darkTheme = {
  title: { textStyle: { color: '#f5f5f7' } },
  legend: { textStyle: { color: '#86868b' } },
  xAxis: { 
    axisLine: { lineStyle: { color: '#48484a' } },
    axisLabel: { color: '#86868b' }
  },
  yAxis: {
    splitLine: { lineStyle: { color: '#2c2c2e' } },
    axisLabel: { color: '#86868b' }
  }
};
```

## 使用检查清单

- [ ] 使用中性色调配色方案
- [ ] 图表标题清晰可读
- [ ] Tooltip 样式与整体风格一致
- [ ] 网格线使用浅色虚线
- [ ] 图例位置合理
- [ ] 响应式容器设置
- [ ] 暗色模式适配
- [ ] 动画效果自然流畅


