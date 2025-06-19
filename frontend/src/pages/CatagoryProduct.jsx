import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import CategroyWiseProductDisplay from "../components/CategroyWiseProductDisplay";
import SummerApi from "../common";

function CatagoryProduct() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ track which categories are checked
  const [selectedCatagory, setSelectedCatagory] = useState({});
  const [filtercatagory, setFiltercatagory] = useState([]);

  const location = useLocation();
  const params   = useParams();

  /* -----------------------------------------------------------
     1.  Read ?catagory=a,b,c from the URL and pre‑select them
  ----------------------------------------------------------- */
  useEffect(() => {
    const list = new URLSearchParams(location.search)
      .get("catagory")
      ?.split(",") || [];

    if (list.length) {
      const preset = {};
      list.forEach((c) => (preset[c] = true));
      setSelectedCatagory(preset);
    }
  }, [location.search]);

  /* -----------------------------------------------------------
     2.  Whenever selectedCatagory changes, update filtercatagory
  ----------------------------------------------------------- */
  useEffect(() => {
    const active = Object.keys(selectedCatagory).filter(
      (key) => selectedCatagory[key]
    );
    setFiltercatagory(active);
  }, [selectedCatagory]);

  /* -----------------------------------------------------------
     3.  Fetch products whenever filtercatagory changes
  ----------------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(SummerApi.filterProduct.url, {
          method: SummerApi.filterProduct.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: filtercatagory }),
        });
        const json = await res.json();
        setData(json?.data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtercatagory]);

  /* -----------------------------------------------------------
     4.  Render
  ----------------------------------------------------------- */
  return (
    <div className="container mx-auto p-4">
      <div className="px-4">
        <p className="font-medium text-slate-800 text-lg my-2">
          Search Results :
        </p>

        <div className="min-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Route‑param‑based listing */}
          {params.catagoryName && (
            <CategroyWiseProductDisplay
              category={params.catagoryName}
              heading="Recommended Product"
            />
          )}

          {/* Filter‑based listing (when no :catagoryName in route) */}
          {!params.catagoryName && !loading && data.length > 0 && (
            <CategroyWiseProductDisplay
              category=""
              data={data}
              heading="Recommended Product"
            />
          )}

          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

export default CatagoryProduct;
