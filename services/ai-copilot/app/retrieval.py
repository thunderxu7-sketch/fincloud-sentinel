import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class RetrievedDocument:
    source: str
    excerpt: str
    score: float


def _tokens(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9_\-]+|[\u4e00-\u9fff]", value.lower()))


class RunbookRetriever:
    def __init__(self, knowledge_dir: Path):
        self._documents = [
            (path.name, path.read_text(encoding="utf-8"))
            for path in sorted(knowledge_dir.glob("*.md"))
        ]

    def search(self, query: str, limit: int = 3) -> list[RetrievedDocument]:
        query_tokens = _tokens(query)
        ranked: list[RetrievedDocument] = []
        for source, content in self._documents:
            sections = [section.strip() for section in content.split("\n\n") if section.strip()]
            best_section = max(
                sections,
                key=lambda section: len(query_tokens & _tokens(section)),
                default=content,
            )
            overlap = len(query_tokens & _tokens(best_section))
            score = overlap / max(len(query_tokens), 1)
            ranked.append(
                RetrievedDocument(source=source, excerpt=best_section[:420], score=round(score, 3))
            )
        return sorted(ranked, key=lambda item: item.score, reverse=True)[:limit]
