import "@logseq/libs";
import * as cheerio from "cheerio";

class Define {
    explanation: string;
    examples: string[];
    topics: string[];
    SYNONYM: string;
    OPPOSITE: string;
    constructor(
        explanation: string,
        examples: string[],
        topics: string[],
        SYNONYM: string,
        OPPOSITE: string
    ) {
        this.explanation = explanation;
        this.examples = examples;
        this.topics = topics;
        this.SYNONYM = SYNONYM;
        this.OPPOSITE = OPPOSITE;
    }
    to_block() {
        let example_blocks = [];
        if (this.SYNONYM != "") {
            example_blocks.push({ content: "SYNONYM" + this.SYNONYM });
        }
        if (this.OPPOSITE != "") {
            example_blocks.push({ content: "OPPOSITE" + this.OPPOSITE });
        }
        return {
            content: this.explanation,
            children: example_blocks.concat(
                this.examples.map((e) => {
                    return { content: e };
                })
            ),
        };
    }
}
class Word {
    wordClass: string;
    pronunciation: string;
    defineList: Define[];
    constructor(
        wordClass: string,
        pronunciation: string,
        defineList: Define[]
    ) {
        this.wordClass = wordClass;
        this.pronunciation = pronunciation;
        this.defineList = defineList;
    }

    to_block() {
        return [
            {
                content: this.pronunciation,
            },
            {
                content: this.wordClass,
                children: this.defineList.map((d) => {
                    return d.to_block();
                }),
            },
        ];
    }
}


async function search_word(word: string) {
    const request = await fetch("http://127.0.0.1:8000/def/" + word);
    const status = await request.status;
    const response = await request.json();
    console.log(status);
    console.log(response);

    const $ = cheerio.load(response["definition"]);
    const form = $(".webtop .pos").text();
    const pronuce = $(".phons_br").text();

    const deflineList: Define[] = [];
    const definitions = $(".senses_multiple .sense");
    for (let i = 0; i < definitions.length; i++) {
        const variants = $(definitions[i]).find(".variants").text();
        const grammar = $(definitions[i]).find(".grammar").text();
        const definition = $(definitions[i]).find(".def").text();
        const explanation = variants + " " + grammar + " " + definition;
        const exampleElements = $(definitions[i]).find(".examples li");
        const examples: string[] = [];
        for (let j = 0; j < exampleElements.length; j++) {
            const example = $(exampleElements[j]).text();
            examples.push(example);
        }
        const topicElements = $(definitions[i]).find(".topic-g a");
        const topics: string[] = [];
        for (let j = 0; j < topicElements.length; j++) {
            const topic_name = $(topics[j]).find(".topic_name").text();
            const topic_cefr = $(topics[j]).find(".topic_cefr").text();
            topics.push(topic_name + " " + topic_cefr);
        }
        const sysnonym = $(definitions[i])
            .find('a[title="fairness definition"]')
            .text();
        const opposite = $(definitions[i])
            .find('a[title="inequity definition"]')
            .text();
        deflineList.push(
            new Define(explanation, examples, topics, sysnonym, opposite)
        );
    }

    const wordDef = new Word(form, pronuce, deflineList);
    return wordDef;
}

async function main() {
    console.info(`WordDefine: MAIN`);
    logseq.Editor.registerSlashCommand("word_define", async () => {
        const block = await logseq.Editor.getCurrentBlock();
        if (!block) {
            return;
        }
        let content = await logseq.Editor.getEditingBlockContent();
        console.log(content);
        const word = await search_word(content);
        console.log(word.to_block());
        // word.pronunciation
        await logseq.Editor.insertBatchBlock(block.uuid, word.to_block(), {
            sibling: false,
        });
    });
}

logseq.ready(main).catch(() => console.error);
