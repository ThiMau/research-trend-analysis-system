import { useEffect, useState } from "react";
import axiosClient from "../../Api/axiosClient";
import "./Filter.css";

export default function Filter({ onChange }) {
    const [fields, setFields] = useState([]);
    const [years, setYears] = useState([]);
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [journals, setJournals] = useState([]);

    const [filters, setFilters] = useState({
        fieldId: "",
        topicId: "",
        keyword: "",
        journal: "",
        fromYear: "",
        toYear: "",
        isOpenAccess: ""
    });

    useEffect(() => {
        loadFilters();
    }, []);

    const loadFilters = async () => {
        try {
            const [
                fieldRes,
                yearRes,
                topicRes,
                keywordRes,
                journalRes
            ] = await Promise.all([
                axiosClient.get("/api/member/fields"),
                axiosClient.get("/api/member/papers/filters/years"),
                axiosClient.get("/api/member/papers/filters/topics"),
                axiosClient.get("/api/member/papers/filters/keywords"),
                axiosClient.get("/api/member/papers/filters/journals")
            ]);

            setFields(fieldRes.data.result || []);
            setYears(yearRes.data.result || []);
            setTopics(topicRes.data.result || []);
            setKeywords(keywordRes.data.result || []);
            setJournals(journalRes.data.result || []);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (name, value) => {
        const newFilters = {
            ...filters,
            [name]: value
        };
        setFilters(newFilters);
        onChange?.(newFilters);
    };

    return (
        <div className="filter-bar">
            {/* FIELD */}
            <select
                value={filters.fieldId}
                onChange={(e) => handleChange("fieldId", e.target.value)}
            >
                <option value="">All Fields</option>
                {fields.map(field => (
                    <option key={field.fieldId} value={field.fieldId}>
                        {field.fieldName}
                    </option>
                ))}
            </select>

            {/* TOPIC */}
            <select
                value={filters.topicId}
                onChange={(e) => handleChange("topicId", e.target.value)}
            >
                <option value="">All Topics</option>
                {topics.map(topic => (
                    <option key={topic.value} value={topic.value}>
                        {topic.label}
                    </option>
                ))}
            </select>

            {/* KEYWORD */}
            <select
                value={filters.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
            >
                <option value="">All Keywords</option>
                {keywords.map(item => (
                    <option key={item.value} value={item.label}>
                        {item.label}
                    </option>
                ))}
            </select>

            {/* JOURNAL */}
            <select
                value={filters.journal}
                onChange={(e) => handleChange("journal", e.target.value)}
            >
                <option value="">All Journals</option>
                {journals.map(item => (
                    <option key={item.value} value={item.label}>
                        {item.label}
                    </option>
                ))}
            </select>

            {/* FROM YEAR */}
            <select
                value={filters.fromYear}
                onChange={(e) => handleChange("fromYear", e.target.value)}
            >
                <option value="">From Year</option>
                {years.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>

            {/* TO YEAR */}
            <select
                value={filters.toYear}
                onChange={(e) => handleChange("toYear", e.target.value)}
            >
                <option value="">To Year</option>
                {years.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>

            {/* OPEN ACCESS */}
            <select
                value={filters.isOpenAccess}
                onChange={(e) => handleChange("isOpenAccess", e.target.value)}
            >
                <option value="">All Access</option>
                <option value="true">Open Access</option>
                <option value="false">Closed Access</option>
            </select>
        </div>
    );
}