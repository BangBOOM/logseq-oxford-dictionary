from http import cookiejar
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BlockAll(cookiejar.CookiePolicy):
    """ policy to block cookies """
    return_ok = set_ok = domain_return_ok = path_return_ok = lambda self, *args, **kwargs: False
    netscape = True
    rfc2965 = hide_cookie2 = False


@app.get("/def/{word}")
def get_word(word: str):
    base_url = f"https://www.oxfordlearnersdictionaries.com/definition/english/{word}"
    req = requests.Session()
    req.cookies.set_policy(BlockAll())

    response = req.get(base_url, timeout=5, headers={'User-agent': 'mother animal'})
    if response.status_code == 404:
        return {
            "word": word,
            "status_code": response.status_code
        }
    else:
        return {
            "word": word,
            "definition": response.content,
            "status_code": response.status_code
        }
