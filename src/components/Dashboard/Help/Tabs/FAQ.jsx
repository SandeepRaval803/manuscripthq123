"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/common/Loader";

const categoryDescriptions = {
  "general questions": "General questions about ManuscriptPRO.",
  "manuscript manager": "Questions about organizing your manuscript.",
  editor: "Questions about the writing environment.",
  "formating wizard": "Questions about formatting and exporting.",
  "publishing checklist": "Questions about the publishing process.",
};

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

export function FAQ() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  useEffect(() => {
    fetch("https://apis.manuscripthq.com/api/faqscategories/getall")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCategories(data.data);
          if (data.data.length) setActiveCategory(data.data[0]._id);
        }
      });
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingFaqs(true);
    fetch(
      `https://apis.manuscripthq.com/api/faqs/get/category/${activeCategory}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.data?.faqs || []);
        setLoadingFaqs(false);
      })
      .catch(() => setLoadingFaqs(false));
  }, [activeCategory]);

  const getCategoryDescription = (title) => {
    return (
      categoryDescriptions[normalize(title)] ||
      "Find answers to common questions in this section."
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about ManuscriptPRO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                disabled={loadingFaqs}
                className={`rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition ${
                  activeCategory === category._id
                    ? "bg-primary text-white"
                    : "bg-[#eaa8f9]"
                } ${loadingFaqs ? "opacity-60 pointer-events-none" : ""}`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {categories
        .filter((category) => category._id === activeCategory)
        .map((category) => (
          <Card key={category._id}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>
                {getCategoryDescription(category.title)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFaqs ? (
                <Loader />
              ) : faqs.length ? (
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, idx) => (
                    <AccordionItem
                      key={faq._id || idx}
                      value={`item-${idx}`}
                      className="border-primary"
                    >
                      <AccordionTrigger className="text-left text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div>No FAQs found in this category.</div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
