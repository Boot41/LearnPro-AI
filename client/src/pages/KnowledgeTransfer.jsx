import React, { useEffect, useState } from "react";
import { getGiveKt, getReceiveKt } from "../services/ktService";
import { useNavigate } from "react-router-dom";
import {
  getLKitTokenGiveKt,
  getLKitTokenTakeKt,
} from "../services/conversationService";
import { saveGivenKtTranscripts } from "../services/ktService";
export const KnowledgeTransfer = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [giveKtInfo, setGiveKtInfo] = useState();
  const [takeKtInfo, setTakeKtInfo] = useState();
  useEffect(() => {
    async function getAssignedGiveKt() {
      try {
        const data = await getGiveKt();
        setGiveKtInfo(data);
        console.log("give kt", data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAssignedTakeKt() {
      try {
        const data = await getReceiveKt();
        console.log("recieve kt", data);
        setTakeKtInfo(data);
      } catch (error) {
        console.log(error);
      }
    }

    getAssignedGiveKt();
    getAssignedTakeKt();
  }, []);
  const handleGiveKt = async () => {
    const livekit_creds = await getLKitTokenGiveKt();
    localStorage.setItem("livekit_creds", JSON.stringify(livekit_creds));
    console.log("handle give kt");

    navigate("/voice-ai");
  };
  const handleTakeKt = async () => {
    livekit_creds = await getLKitTokenTakeKt();
    localStorage.setItem("livekit_creds", livekit_creds);
    console.log("handle take kt");
    navigate("/voice-ai");
  };

  const submit_test = async () => {
    const transcriptions = [
      {
        id: "SG_88981b219cd4",
        text: "Hey, how can I help you today?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185226657,
        lastReceivedTime: 1742185228386,
      },
      {
        id: "SG_210b531a45ac",
        text: "And what is our topic of discussion today?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185236514,
        lastReceivedTime: 1742185237651,
      },
      {
        id: "SG_b14ce06b52a1",
        text: "We're going to conduct a comprehensive knowledge transfer session about our product named Test 2.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185239641,
        lastReceivedTime: 1742185245798,
      },
      {
        id: "SG_1f5bcdd439e0",
        text: "I'll be asking questions across various categories, including Product Overview and Business Context, Product History and Evolution, Architecture and Design, Technology Stack and Dependencies, and more.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185246195,
        lastReceivedTime: 1742185256097,
      },
      {
        id: "SG_ba85b9f686ef",
        text: "The goal is to capture all critical information about the product, its history, design, technology, and operational aspects.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185256686,
        lastReceivedTime: 1742185263591,
      },
      {
        id: "SG_3453dd2cd4d6",
        text: "Okay. Let's start",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185269100,
        lastReceivedTime: 1742185269362,
      },
      {
        id: "SG_cd45b05c66a6",
        text: "Let's begin with the first question in the Product Overview and Business Context category.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185271131,
        lastReceivedTime: 1742185276776,
      },
      {
        id: "SG_81db957db24c",
        text: "Here it is:  1.1. What is the primary purpose of this product?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185277176,
        lastReceivedTime: 1742185280331,
      },
      {
        id: "SG_c1708df740df",
        text: "Please provide a detailed answer, and I'll take it from there.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185280904,
        lastReceivedTime: 1742185283191,
      },
      {
        id: "SG_e5f39c0bc7d8",
        text: "this product is built to test",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185286470,
        lastReceivedTime: 1742185289466,
      },
      {
        id: "SG_4ec5b0334bd2",
        text: "people who are actually joining a new company.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185289471,
        lastReceivedTime: 1742185291381,
      },
      {
        id: "SG_4db57d7896f0",
        text: "So, the primary purpose of Test 2 is to assess and evaluate individuals who are joining a new company.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185293119,
        lastReceivedTime: 1742185301365,
      },
      {
        id: "SG_4512d62f787d",
        text: "Can you tell me a bit more about who these individuals are - are they new hires, are they being considered for a specific role, and what kind of skills or abilities are they being tested for?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185301768,
        lastReceivedTime: 1742185310178,
      },
      {
        id: "SG_5660764822d9",
        text: "Additionally, what is the ultimate goal of this testing process - is it to determine if they're a good fit for the company, or to identify specific areas where they may need training or support?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185310990,
        lastReceivedTime: 1742185320517,
      },
      {
        id: "SG_40c1021a8eef",
        text: "No. It's a general testing platform.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185328561,
        lastReceivedTime: 1742185330870,
      },
      {
        id: "SG_7c88ed963c96",
        text: "The administration will provide you with topics and",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185331835,
        lastReceivedTime: 1742185335837,
      },
      {
        id: "SG_63b5467ff8ff",
        text: "then those people will have to pass the test on those particular topics.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185335843,
        lastReceivedTime: 1742185338668,
      },
      {
        id: "SG_19a248920c8f",
        text: "So, Test 2 is a general-purpose testing platform that allows administrators to create and deploy tests on specific topics, and individuals can take the tests to demonstrate their knowledge and understanding of those topics.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185340942,
        lastReceivedTime: 1742185356854,
      },
      {
        id: "SG_b4b31c8776d6",
        text: "That's a very versatile platform.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185357184,
        lastReceivedTime: 1742185357189,
      },
      {
        id: "SG_d42fa0a42817",
        text: "Can you tell me more about the types of topics that are typically covered by tests on this platform?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185357602,
        lastReceivedTime: 1742185361606,
      },
      {
        id: "SG_085cad753d57",
        text: "For example, are they primarily focused on technical skills, or are they more focused on soft skills or general knowledge?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185362090,
        lastReceivedTime: 1742185368776,
      },
      {
        id: "SG_62a2a0644ee3",
        text: "Are there any specific industries or domains that this platform is commonly used in?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185369255,
        lastReceivedTime: 1742185372182,
      },
      {
        id: "SG_bfd8135890b5",
        text: "Yeah. Usually,",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185374802,
        lastReceivedTime: 1742185376862,
      },
      {
        id: "SG_0233fb35c4c2",
        text: "topics are related to technology and all.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185376868,
        lastReceivedTime: 1742185378310,
      },
      {
        id: "SG_ff70402398c2",
        text: "And, yes, it is majorly used in technology sector.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185379324,
        lastReceivedTime: 1742185381721,
      },
      {
        id: "SG_da60bf476d13",
        text: "So",
        startTime: 0,
        endTime: 0,
        final: false,
        language: "",
        firstReceivedTime: 1742185379504,
        lastReceivedTime: 1742185379504,
      },
      {
        id: "SG_6842a9134ae0",
        text: "So, Test 2 is primarily focused on testing technical knowledge and skills in the technology sector.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185384176,
        lastReceivedTime: 1742185391375,
      },
      {
        id: "SG_1e31d68cece4",
        text: "This could include topics such as programming languages, software development, IT infrastructure, cybersecurity, and more.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185391780,
        lastReceivedTime: 1742185396816,
      },
      {
        id: "SG_d46fa22cb0bb",
        text: "Next question: 1.2. Who is the target audience or customer for this product?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185397409,
        lastReceivedTime: 1742185401302,
      },
      {
        id: "SG_45c48db97161",
        text: "Is it primarily used by companies to test their own employees, or is it also used by educational institutions or individuals for personal use?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185401897,
        lastReceivedTime: 1742185410706,
      },
      {
        id: "SG_0a0dae217c85",
        text: "Can you walk me through the typical buyer persona for this product?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185411295,
        lastReceivedTime: 1742185413264,
      },
      {
        id: "SG_824156a240ee",
        text: "Everyone uses it usually.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185415853,
        lastReceivedTime: 1742185417757,
      },
      {
        id: "SG_8a91e4210745",
        text: "It sounds like Test 2 is a widely-used platform across various groups and organizations, including companies, educational institutions, and potentially even individuals.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185419639,
        lastReceivedTime: 1742185432848,
      },
      {
        id: "SG_981ae0b8f852",
        text: "So, it's a relatively large-scale platform with a broad range of users.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185433250,
        lastReceivedTime: 1742185435771,
      },
      {
        id: "SG_4aafbfa9c849",
        text: "Next question: 1.3. What problem(s) does the product aim to solve?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185436232,
        lastReceivedTime: 1742185439359,
      },
      {
        id: "SG_1008af7cfa4f",
        text: "For example, is it primarily used to identify skill gaps, measure employee performance, or screen candidates for job openings?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185439806,
        lastReceivedTime: 1742185447797,
      },
      {
        id: "SG_ad4de04b753f",
        text: "Or is it used for something else entirely?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185448314,
        lastReceivedTime: 1742185449133,
      },
      {
        id: "SG_a37446828801",
        text: "Uh, it is used majorly for testing purposes.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185452901,
        lastReceivedTime: 1742185454791,
      },
      {
        id: "SG_64fc9c2ab635",
        text: "So, the main purpose of Test 2 is to enable testing, which could include a wide range of activities such as assessing knowledge, skills, and abilities, evaluating candidate qualifications, or measuring employee performance.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185456680,
        lastReceivedTime: 1742185472771,
      },
      {
        id: "SG_d45251e55bd2",
        text: "Can you tell me a bit more about how Test 2 helps with this testing process?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185473173,
        lastReceivedTime: 1742185473180,
      },
      {
        id: "SG_319aaf56d7a1",
        text: "For example, what makes it unique or effective compared to other testing platforms, and what kind of features or functionality does it offer to support testing activities?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185473669,
        lastReceivedTime: 1742185482536,
      },
      {
        id: "SG_eeef6f226c3b",
        text: "Hey. Can you give me a minute?",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185488561,
        lastReceivedTime: 1742185489159,
      },
      {
        id: "SG_f4f623eafd46",
        text: "Take your time, I'll wait.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185490771,
        lastReceivedTime: 1742185491949,
      },
      {
        id: "SG_08b5747fce6c",
        text: "We can continue the conversation whenever you're ready.",
        startTime: 0,
        endTime: 0,
        final: true,
        language: "",
        firstReceivedTime: 1742185492354,
        lastReceivedTime: 1742185494622,
      },
    ];
    const transcripts_parsed = transcriptions.map((transcipt_obj) => {
      return transcipt_obj.text;
    });
    const give_kt_id = 3;
    await saveGivenKtTranscripts(transcripts_parsed, give_kt_id);
    if (!transcriptions) {
      console.error("No transcriptions found");
      return;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <button onClick={submit_test}>submit</button>
      <div className="bg-white rounded-lg shadow p-6">
        {giveKtInfo ? (
          <div>
            <span>Give Knowledge Transfer</span>
            <div className="grid grid-cols-4 place-items-start md:items-center md:justify-between">
              <div className="mt-4 md:mt-0">{giveKtInfo.project_name}</div>
              <div className="mt-4 md:mt-0">{giveKtInfo.project_id}</div>
              <div className="mt-4 md:mt-0">{giveKtInfo.status}</div>
              <button
                disabled={giveKtInfo.status == "Completed"}
                onClick={handleGiveKt}
                className={`px-4 py-2 w-36 place-self-end text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } rounded-md flex items-center justify-center`}
              >
                Give K.T
              </button>
            </div>
          </div>
        ) : (
          <div>You do not have any assigned projects to knowledge transfer</div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {takeKtInfo ? (
          <div>
            <span>Take Knowledge Transfer</span>
            <div className="grid grid-cols-4 place-items-start md:items-center md:justify-between">
              <div className="mt-4 md:mt-0">{takeKtInfo[0].project_name}</div>
              <div className="mt-4 md:mt-0">{takeKtInfo[0].project_id}</div>
              <div className="mt-4 md:mt-0">{takeKtInfo[0].status}</div>
              <button
                disabled={takeKtInfo[0].status == "Completed"}
                onClick={handleTakeKt}
                className={`px-4 place-self-end py-2 w-36 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } rounded-md flex items-center justify-center`}
              >
                Take K.T
              </button>
            </div>
          </div>
        ) : (
          <div>
            You do not have any assigned projects to receive knowledge transfer
          </div>
        )}
      </div>
    </div>
  );
};
export default KnowledgeTransfer;
