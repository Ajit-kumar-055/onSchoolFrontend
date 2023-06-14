import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchData = async (pageNumber) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.196.214:8088/api/topics/${pageNumber}`
      );
      const newData = response.data;
      if (newData) {
        setTopics((prevTopics) => {
          const uniqueTopics = new Map(
            prevTopics.map((topic) => [topic.topicId, topic])
          );
          uniqueTopics.set(newData.topicId, newData);
          return Array.from(uniqueTopics.values());
        });
        setPage(pageNumber + 1);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !isLoading &&
      hasMoreData
    ) {
      fetchData(page);
    }
  }, 200);

  useEffect(() => {
    fetchData(page);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleAnswerSelection = (topicId, questionIndex, answerIndex) => {
    setTopics((prevTopics) => {
      const updatedTopics = prevTopics.map((topic) => {
        if (topic.topicId === topicId) {
          const updatedQuiz = { ...topic.quiz };
          const updatedQuestions = updatedQuiz.questions.map((question, index) => {
            if (index === questionIndex) {
              return {
                ...question,
                selectedAnswerIndex: answerIndex,
              };
            }
            return question;
          });
          updatedQuiz.questions = updatedQuestions;
          return {
            ...topic,
            quiz: updatedQuiz,
          };
        }
        return topic;
      });
      return updatedTopics;
    });
  };

  return (
    <div>
      <div className="content-container">
        <div className="card-container">
          {topics.map((topic) => (
            <div className="card-center" key={topic.topicId}>
              <h3>{topic.title}</h3>
              <p>{topic.content}</p>
              {topic.videoLink && (
                <iframe
                  width="800"
                  height="480"
                  src={topic.videoLink}
                  title="YouTube video player"
                  allow="autoplay;"
                ></iframe>
              )}
              {topic.quiz && (
                <div>
                  <h4>Quiz</h4>
                  <div className="quiz-container">
                    {topic.quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="question-container">
                        <p>{question.question}</p>
                        <ul>
                          {question.answers.map((answer, answerIndex) => (
                            <li
                              key={answerIndex}
                              className={
                                question.selectedAnswerIndex === answerIndex
                                  ? answerIndex === question.correctAnswerIndex
                                    ? "correct"
                                    : "incorrect"
                                  : ""
                              }
                            >
                              <input
                                type="radio"
                                id={`topic-${topic.topicId}-question-${questionIndex}-answer-${answerIndex}`}
                                name={`topic-${topic.topicId}-question-${questionIndex}`}
                                value={answerIndex}
                                checked={question.selectedAnswerIndex === answerIndex}
                                onChange={() =>
                                  handleAnswerSelection(
                                    topic.topicId,
                                    questionIndex,
                                    answerIndex
                                  )
                                }
                              />
                              <label
                                htmlFor={`topic-${topic.topicId}-question-${questionIndex}-answer-${answerIndex}`}
                              >
                                {answer}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className="loading">Loading...</div>}
          {!isLoading && !hasMoreData && (
            <div className="no-data">No more data present</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
