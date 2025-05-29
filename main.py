from flask import Flask, jsonify, send_from_directory
import requests
import os
import random
from dotenv import load_dotenv
import flask

app = Flask(__name__, static_folder="static", static_url_path="")

# Récupérer la clé GitHub depuis une variable d'environnement ou un fichier
load_dotenv()
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

@app.route("/")
def index():
    # Sert le fichier index.html du dossier static
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    # Sert les fichiers statiques (JS, CSS, images, etc.)
    return send_from_directory(app.static_folder, path)

@app.route("/api/repo-random")
def repo_random():
    if not GITHUB_TOKEN:
        return jsonify({"error": "GitHub token not found"}), 500

    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    language = flask.request.args.get('language')
    q = "stars:>100"
    if language and language not in ["", "Tous", "Autre"]:
        q += f" language:{language}"
    page = random.randint(1, 100)
    url = f"https://api.github.com/search/repositories?q={q}&sort=stars&order=desc&page={page}&per_page=1"
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        return jsonify({"error": "GitHub API error", "details": resp.json()}), 500

    items = resp.json().get("items", [])
    if not items:
        return jsonify({"error": "No repositories found"}), 404

    repo = items[0]
    topics_url = repo["url"] + "/topics"
    topics_resp = requests.get(topics_url, headers={**headers, "Accept": "application/vnd.github.mercy-preview+json"})
    topics = topics_resp.json().get("names", []) if topics_resp.status_code == 200 else []

    return jsonify({
        "name": repo["full_name"],
        "description": repo["description"],
        "url": repo["html_url"],
        "stars": repo["stargazers_count"],
        "language": repo["language"],
        "topics": topics,
        "updated_at": repo["updated_at"]
    })

if __name__ == "__main__":
    app.run(debug=True)
