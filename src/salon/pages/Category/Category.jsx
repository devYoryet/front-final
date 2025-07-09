import React, { act, useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesBySalon } from "../../../Redux/Category/action";
import CategoryTable from "./CategoryTable";
import { Button } from "@mui/material";
import { fetchCategoriesBySalonOwner } from "../../../Redux/Category/action";

const Category = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { category, salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(fetchCategoriesBySalonOwner(localStorage.getItem("jwt")));
}, []);


  console.log("salon ",salon)

  const handleTabChange = (tab) => () => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex items-center gap-5">
        <Button
          onClick={handleTabChange(1)}
          variant={activeTab == 1 ? "contained" : "outlined"}
        >
          All Categories
        </Button>
        <Button
          onClick={handleTabChange(2)}
          variant={activeTab == 2 ? "contained" : "outlined"}
        >
          Create New Category
        </Button>
      </div>
      <div className="mt-10">
        {activeTab === 1 ? <CategoryTable /> : <CategoryForm />}
      </div>
    </div>
  );
};

export default Category;
