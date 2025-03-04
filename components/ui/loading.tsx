import React from "react";

const Loader = () => {
  return (
    <div className="inline-grid w-20 aspect-square animate-spin ">
      <div className="loader before:content-[''] after:content-[''] before:absolute after:absolute before:inset-0 after:inset-0 before:clip-path-polygon-[100%_50%,83.81%_59.06%,93.3%_75%,74.75%_74.75%,75%_93.3%,59.06%_83.81%,50%_100%,40.94%_83.81%,25%_93.3%,25.25%_74.75%,6.7%_75%,16.19%_59.06%,0%_50%,16.19%_40.94%,6.7%_25%,25.25%_25.25%,25%_6.7%,40.94%_16.19%,50%_0%,59.06%_16.19%,75%_6.7%,74.75%_25.25%,93.3%_25%,83.81%_40.94%] before:bg-[#1c1d1e] before:animate-[spin_2s_linear_infinite,spin_7s_linear_infinite_alternate] after:clip-path-polygon-[100%_50%,78.19%_60.26%,88.3%_82.14%,65%_75.98%,58.68%_99.24%,44.79%_79.54%,25%_93.3%,27.02%_69.28%,3.02%_67.1%,20%_50%,3.02%_32.9%,27.02%_30.72%,25%_6.7%,44.79%_20.46%,58.68%_0.76%,65%_24.02%,88.3%_17.86%,78.19%_39.74%] after:bg-[#edf0f2] after:m-[12.5%] after:animate-[spin_7s_linear_infinite_alternate]" />
    </div>
  );
};

export default Loader;
