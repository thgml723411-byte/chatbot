import OpenAI from "openai";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// 제공된 질문과 rag파일을 가지고 관련 단원을 검색
const searchGuide = (question: string, guideText: string) => {
  const normalize = (text: string) => {
    return text.toLocaleLowerCase().replace(/\s+/g,"");
  };

  //js가 질문을 비교하기 쉬운 형태로 변경
  const useQuestion = normalize(question);

  //텍스트 파일을 단원별로 나누기
  const sections = guideText.split(/(?=\[\d{2}\.\s)/);

  /* 결과 예시
     [01.홈페이지 소개].....section[0]
     [02.React 학습 페이지].....section[1]
     [03.AI 개념 설명].....section[2]
  */

  //공통 규칙 가져오기
   const commonRule = sections.find(
    item => item.includes('[00.챗봇 공통 답변 원칙]')
   )

   /*
   for(let i=0; i<sections.length; i++){
     const item = sections[i]
         여기는 명령문
   }
         for..of문을 사용하면 for문보다 간편하다
   */

   const results:{
     text : string
     score : number
   }[] = [] //섹션과 섹션의 점수 결과가 들어갈 반 배열 설정

   for(const item of sections){
     if(item.includes('[00.챗봇 공통 답변 원칙]')){
        continue
     }

       const title = item.match(/대표명칭:\s*(.+)/)
       //title[0]::대표 명칭:홈페이지소개
       //title[1]::홈페이지 소개

       const keywords = item.match(/관련표현:\s*([\s\S]*?)(?=\n\s*\n|기능설명:)/)
       //keywords[0]관련표현:AI퀴즈,ai퀴즈,AIQulz,퀴즈,문제,문제풀기,문제출제,문제내줘,
       //keywords[1]AI퀴즈,ai퀴즈,AIQulz,퀴즈,문제,문제풀기,문제출제,문제내줘,
       
       const words = [title?.[1],...(keywords?.[1].split(',')||[])]
       //words[0]::홈페이지 소개
       //words[1]::AI퀴즈
       //words[2]::ai퀴즈

       let score = 0;
       for(const initem of words){
        if(!initem)continue
         const keyword = normalize(initem)
         if(!keyword)continue
         if(useQuestion.includes(keyword)){
           score += keyword.length
         }
       }
          if(score > 0){
            results.push({
              text : item,
              score
            })
       }
   }
    /*
    const results = [
      {text : 'ai퀴즈',score : 30},
      {text : '회원가입',score : 20},
      {text : '로그인설명',score : 60},
      {text : '채팅설명',score : 5},
    ]
    */
    results.sort((a,b)=>b.score-a.score)

    //가장 관련성이 높은 단원 최대 3개 선택
    const selected = results.slice(0,3).map(item=>item.text).join('\n\n')
    /*
    ai퀴즈
    회원가입
    로그인설명
    */
   return commonRule + '\n\n' + selected
};

export const POST = async (req: Request) => {
  try {
    const { question } = await req.json();

    if (typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "질문을 입력해 주세요" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const openai = new OpenAI({ apiKey });

    const filePath = path.join(
      process.cwd(), // 프로젝트 최상위 폴더의 경로를 가지고 온다
                    // 예 C:\lar\next\project01/
      'public', //
      'data', //
      'next_step4_guide_rag_complete.txt' //
    );

    const guideText = await readFile(filePath, "utf8");

    const searchResult = searchGuide(question,guideText)
    if(!searchResult.trim()){
      return NextResponse.json({
        answer:'죄송합니다 해당 내용은 찾지 못했습니다,react학습,ai퀴즈,힌트,로그인 채팅등의 기능'
      })
    }
      const response = await openai.responses.create({
         model : 'gpt-4.1-mini',
         instructions:`당신은 react학습 홈페이지의 안내 챗봇입니다
         아래 검색된 홈페이지 아내자료만 참고하여 사용자 질문에 답변하세요
         답변규칙
         1.자료에 없는 기능은 만들어내지 마세요
         2.대소문자와 띄어쓰기 차이를 무시하세요
         3.퀴즈와 문제처럼 비슷한 표현을 이해하세요
         4.짧고 친철한 한국어로 대답하세요
         5.사용자가 이용 방법을 질문하면 순서대로 쉽게 설명하세요
         [검색된 홈페이지 안내 자료]
         ${searchResult}`,
         input:question
         
      })
      return NextResponse.json({
         answer : response.output_text
      })
  } catch (err) {
      console.error('챗봇오류:',err)
      return NextResponse.json(
        {error : 'ai 답변 생성에 실패했습니다'},
        {status : 500}
      )
  }
};

