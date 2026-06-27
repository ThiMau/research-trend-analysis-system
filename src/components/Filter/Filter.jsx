import { useEffect, useState } from "react";
import axiosClient from "../../Api/axiosClient";
import "./Filter.css";

export default function Filter({ onChange }) {

    const [years, setYears] = useState([]);
    const [fields, setFields] = useState([]);
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [journals, setJournals] = useState([]);

    const [filters, setFilters] = useState({
        field: "",
        year: "",
        topic: "",
        keyword: "",
        journal: "",
    });

    useEffect(() => {

        const loadFilters = async () => {

            try {

                const [
                    fieldsRes,
                    yearsRes,
                    topicsRes,
                    keywordsRes,
                    journalsRes
                ] = await Promise.all([
                    axiosClient.get("/api/member/fields"),
                    axiosClient.get("/api/member/papers/filters/years"),
                    axiosClient.get("/api/member/papers/filters/topics"),
                    axiosClient.get("/api/member/papers/filters/keywords"),
                    axiosClient.get("/api/member/papers/filters/journals"),

                ]);
                setFields(fieldsRes.data.result || []);
                setYears(yearsRes.data.result || []);
                setTopics(topicsRes.data.result || []);
                setKeywords(keywordsRes.data.result || []);
                setJournals(journalsRes.data.result || []);

            } catch (err) {
                console.log(err);
            }

        }

        loadFilters();

    }, []);

    const handleChange = (field, value) => {

        const newFilters = {
            ...filters,
            [field]: value
        };

        setFilters(newFilters);

        if (onChange) {
            onChange(newFilters);
        }

    }

    return (

        <div className="filter-bar">
            <select
                value={filters.field}
                onChange={(e) => handleChange("field", e.target.value)}
            >

                <option value="">
                    All Fields
                </option>

                {fields.map(field =>

                    <option
                        key={field.fieldId}
                        value={field.fieldId}
                    >
                        {field.fieldName}
                    </option>

                )}

            </select>



            <select
                value={filters.year}
                onChange={(e) => handleChange("year", e.target.value)}
            >
                <option value="">All Years</option>

                {years.map(item =>

                    <option
                        key={item.value}
                        value={item.value}
                    >
                        {item.label} ({item.count})
                    </option>

                )}

            </select>

            <select
                value={filters.topic}
                onChange={(e) => handleChange("topic", e.target.value)}
            >

                <option value="">All Topics</option>

                {topics.map(item =>

                    <option
                        key={item.value}
                        value={item.value}
                    >
                        {item.label} ({item.count})
                    </option>

                )}

            </select>

            <select
                value={filters.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
            >

                <option value="">All Keywords</option>

                {keywords.map(item =>

                    <option
                        key={item.value}
                        value={item.value}
                    >
                        {item.label} ({item.count})
                    </option>

                )}

            </select>

            <select
                value={filters.journal}
                onChange={(e) => handleChange("journal", e.target.value)}
            >

                <option value="">All Journals</option>

                {journals.map(item =>

                    <option
                        key={item.value}
                        value={item.value}
                    >
                        {item.label} ({item.count})
                    </option>

                )}

            </select>

        </div>

    );

}