import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { darkTheme, lightTheme } from "@/shared/styles";
import {
  PlusIcon,
  SearchIcon,
  NoImageIcon,
  ArrowDownIcon,
} from "@/shared/icons";
import {
  Tag,
  Chip,
  Input,
  Score,
  Table,
  Title,
  Button,
  Rating,
  Status,
  Heading,
  TagList,
  Checkbox,
  Combobox,
  Progress,
  MultiSelect,
  Breadcrumbs,
  RatingCompact,
  TableSkeleton,
  LabeledCombobox,
  LabeledCheckbox,
  showNotification,
  LabeledCheckboxSkeleton,
} from "@/shared/ui";

import * as styles from "./styles.css";

type Theme = "dark" | "light";

const sortOptions = [
  { value: "release-date", label: "По дате выхода" },
  { value: "popularity", label: "По популярности" },
  { value: "rating", label: "По рейтингу" },
  { value: "title", label: "По названию" },
  { value: "start-date", label: "По дате старта" },
];

const genreOptions = [
  { value: "comedy", label: "Комедия" },
  { value: "fantasy", label: "Фэнтези" },
  { label: "Экшен", value: "action" },
  { value: "angels", label: "Ангелы" },
  { value: "cult", label: "Культ" },
  { value: "crime", label: "Криминал" },
  { value: "curses", label: "Проклятия" },
  { value: "demons", label: "Демоны" },
  { label: "Детектив", value: "detective" },
  { value: "elves", label: "Эльфы" },
  { value: "goblins", label: "Гоблины" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Sample({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.sample}>
      <div className={styles.sampleLabel}>{label}</div>
      <div className={styles.sampleBody}>{children}</div>
    </div>
  );
}

function Column({ children }: { children: ReactNode }) {
  return <div className={styles.column}>{children}</div>;
}

function Row({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ratingValue, setRatingValue] = useState(7);

  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = theme === "dark" ? darkTheme : lightTheme;
    const inactiveTheme = theme === "dark" ? lightTheme : darkTheme;

    root.classList.remove(inactiveTheme);
    root.classList.add(activeTheme);
    root.style.colorScheme = theme;
  }, [theme]);

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ANIME LIST · SHARED UI</div>
          <h1 className={styles.title}>UI Kit preview</h1>
          <p className={styles.description}>
            Компоненты из Figma UI Kit. Переключайте варианты и проверяйте
            состояния.
          </p>
        </div>
        <div aria-label="Тема оформления" className={styles.themeSwitch}>
          <Button
            size="s"
            variant="primary"
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            size="s"
            variant="secondary"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
        </div>
      </header>

      <div className={styles.gallery}>
        <Section title="Button">
          <div className={styles.samples}>
            <Sample label="Primary · S">
              <Button>Кнопка</Button>
              <Button round>Кнопка</Button>
              <Button disabled>Кнопка</Button>
              <Button round disabled>
                Кнопка
              </Button>
            </Sample>
            <Sample label="Secondary · S">
              <Button variant="secondary">Кнопка</Button>
              <Button round variant="secondary">
                Кнопка
              </Button>
              <Button disabled variant="secondary">
                Кнопка
              </Button>
              <Button round disabled variant="secondary">
                Кнопка
              </Button>
            </Sample>
            <Sample label="Flat · S">
              <Button variant="flat">Кнопка</Button>
              <Button round variant="flat">
                Кнопка
              </Button>
              <Button disabled variant="flat">
                Кнопка
              </Button>
              <Button round disabled variant="flat">
                Кнопка
              </Button>
            </Sample>
            <Sample label="Размер L · иконки">
              <Button size="l">Кнопка</Button>
              <Button round size="l" variant="secondary">
                Кнопка
              </Button>
              <Button size="l" leftIcon={<ArrowDownIcon />}>
                Кнопка
              </Button>
              <Button size="l" rightIcon={<PlusIcon />}>
                Кнопка
              </Button>
              <Button disabled size="l">
                Кнопка
              </Button>
            </Sample>
          </div>
        </Section>

        <Section title="Status · Chip · Score · Rating">
          <div className={styles.samples}>
            <Sample label="Status · S / M">
              <Status size="s" variant="positive" />
              <Status size="m" variant="info" />
              <Status size="s" variant="negative" />
            </Sample>
            <Sample label="Chip">
              <Column>
                <Chip size="l" icon={<NoImageIcon />} />
                <Chip size="m" icon={<NoImageIcon />} />
                <Chip size="s" icon={<NoImageIcon />} />
                <Chip size="l" icon={<NoImageIcon />} label="Нет изображения" />
                <Chip size="m" icon={<NoImageIcon />} label="Нет изображения" />
                <Chip size="s" icon={<NoImageIcon />} label="Нет изображения" />
              </Column>
            </Sample>
            <Sample label="Score · варианты">
              <Column>
                <Score value={10} variant="positive" />
                <Score value={6} variant="warning" />
                <Score value={3.2} variant="negative" />
              </Column>
              <Column>
                <Score value={9} shadow={false} variant="positive" />
                <Score value={6} shadow={false} variant="warning" />
                <Score value={3.2} shadow={false} variant="negative" />
              </Column>
              <Column>
                <Score size="s" value={8.6} variant="positive" />
                <Score size="s" value={6} variant="warning" />
                <Score size="s" value={3.2} variant="negative" />
              </Column>
              <Column>
                <Score size="s" value={8.6} shadow={false} variant="positive" />
                <Score size="s" value={6} shadow={false} variant="warning" />
                <Score size="s" value={3.2} shadow={false} variant="negative" />
              </Column>
            </Sample>
            <Sample label="Rating · M / S">
              <Column>
                <Column>
                  <span>Выбрано: {ratingValue}</span>
                  <Rating defaultValue={7} onChange={setRatingValue} />
                </Column>
                <RatingCompact value={ratingValue} />
              </Column>
            </Sample>
          </div>
        </Section>

        <Section title="Heading · Title · Breadcrumbs · Tags">
          <div className={styles.samples}>
            <Sample label="Heading · состояния">
              <Row>
                <Column>
                  <Heading size="m" variant="info" />
                  <Heading size="m" variant="neutral" />
                  <Heading size="m" variant="positive" />
                  <Heading size="m" variant="warning" />
                  <Heading size="m" variant="negative" />
                </Column>
                <Column>
                  <Heading size="s" variant="info" />
                  <Heading size="s" variant="neutral" />
                  <Heading size="s" variant="positive" />
                  <Heading size="s" variant="warning" />
                  <Heading size="s" variant="negative" />
                </Column>
              </Row>
            </Sample>
            <Sample label="Title · состояния">
              <div
                style={{
                  gap: "20px",
                  display: "flex",
                  maxWidth: "282px",
                  flexDirection: "column",
                }}
              >
                <Title title="Разгневанная леди поклялась отомстить: Я разрушу свою страну с помощью силы гримуара" />
                <Title title="Акро трип" variant="watching" />
                <Title
                  variant="planning"
                  title="Разгневанная леди поклялась отомстить: Я разрушу свою страну с помощью силы гримуара"
                />
                <Title
                  variant="completed"
                  title="Разгневанная леди поклялась отомстить: Я разрушу свою страну с помощью силы гримуара"
                />
                <Title
                  variant="paused"
                  title="Разгневанная леди поклялась отомстить: Я разрушу свою страну с помощью силы гримуара"
                />
                <Title
                  variant="dropped"
                  title="Разгневанная леди поклялась отомстить: Я разрушу свою страну с помощью силы гримуара"
                />
              </div>
            </Sample>
            <Sample label="Breadcrumbs">
              <Breadcrumbs
                items={[{ to: "/", label: "Аниме" }, { label: "Моё аниме" }]}
              />
              <Breadcrumbs
                items={[
                  { to: "/", label: "Главная" },
                  { to: "/", label: "Каталог" },
                  { label: "Моё аниме" },
                ]}
              />
            </Sample>
            <Sample label="Tag · S / M и TagList">
              <Tag size="s">Ангелы</Tag>
              <Tag size="m">Криминал</Tag>
              <TagList
                onChange={console.log}
                tags={[
                  { id: "angels", label: "Ангелы" },
                  { id: "cult", label: "Культ" },
                  { id: "crime", label: "Криминал" },
                  { id: "curses", label: "Проклятия" },
                  { id: "demons", label: "Демоны" },
                  { id: "detective", label: "Детектив" },
                  { id: "elves", label: "Эльфы" },
                  { id: "goblins", label: "Гоблины" },
                ]}
              />
              <TagList
                size="m"
                onChange={console.log}
                tags={[
                  { id: "action", label: "Экшен" },
                  { id: "comedy", label: "Комедия" },
                  { id: "fantasy", label: "Фэнтези" },
                  { id: "drama", label: "Драма" },
                ]}
              />
            </Sample>
          </div>
        </Section>

        <Section title="Checkbox · Combobox · MultiSelect">
          <div className={styles.samples}>
            <Sample label="Checkbox · интерактивный">
              <Row>
                <Column>
                  <Checkbox />
                  <Checkbox defaultChecked />
                  <Checkbox defaultChecked variant="minus" />
                </Column>
                <Column>
                  <LabeledCheckbox
                    defaultChecked
                    label="Анонсировано"
                    description="(по умолчанию)"
                  />
                  <LabeledCheckbox
                    size="s"
                    defaultChecked
                    label="Анонсировано"
                    description="(по умолчанию)"
                  />
                  <LabeledCheckbox label="Анонсировано" />
                  <LabeledCheckbox variant="minus" label="Анонсировано" />
                  <LabeledCheckboxSkeleton />
                </Column>
              </Row>
            </Sample>
            <Sample label="Combobox · Radix Popover">
              <Combobox options={sortOptions} defaultValue="release-date" />
              <Combobox
                loading
                options={sortOptions}
                defaultValue="release-date"
              />
              <LabeledCombobox
                searchable
                label="Сортировка:"
                options={sortOptions}
                defaultValue="release-date"
              />
            </Sample>
            <Sample label="MultiSelect · Radix Popover">
              <MultiSelect
                options={genreOptions}
                defaultValue={["comedy", "fantasy"]}
              />
              <MultiSelect
                cleanable
                options={genreOptions}
                defaultValue={["comedy", "fantasy"]}
              />
              <MultiSelect loading options={genreOptions} />
              <MultiSelect searchable options={genreOptions} />
            </Sample>
          </div>
        </Section>

        <Section title="Input · Progress · Notifications">
          <div className={styles.samples}>
            <Sample label="Input · default / grayscale">
              <Row>
                <Column>
                  <Input variant="grayscale" defaultValue="Nyaruko" />
                  <Input
                    shadow
                    variant="grayscale"
                    placeholder="Фокусируйте поле"
                  />
                  <Input placeholder="Введите логин" />
                  <Input shadow placeholder="Введите логин" />
                </Column>
                <Column>
                  <Input round variant="grayscale" defaultValue="Nyaruko" />
                  <Input
                    round
                    shadow
                    variant="grayscale"
                    placeholder="Фокусируйте поле"
                  />
                  <Input round placeholder="Введите логин" />
                  <Input round shadow placeholder="Введите логин" />
                </Column>
                <Column>
                  <Input
                    round
                    cleanable
                    variant="grayscale"
                    defaultValue="Nyaruko"
                    leftSlot={<SearchIcon />}
                  />
                  <Input
                    round
                    shadow
                    cleanable
                    variant="grayscale"
                    leftSlot={<SearchIcon />}
                    placeholder="Фокусируйте поле"
                  />
                  <Input
                    round
                    cleanable
                    leftSlot={<SearchIcon />}
                    placeholder="Введите логин"
                  />
                  <Input
                    round
                    shadow
                    cleanable
                    leftSlot={<SearchIcon />}
                    placeholder="Введите логин"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Input size="l" variant="grayscale" defaultValue="Nyaruko" />
                  <Input
                    shadow
                    size="l"
                    variant="grayscale"
                    placeholder="Фокусируйте поле"
                  />
                  <Input size="l" placeholder="Введите логин" />
                  <Input shadow size="l" placeholder="Введите логин" />
                </Column>
                <Column>
                  <Input
                    round
                    size="l"
                    variant="grayscale"
                    defaultValue="Nyaruko"
                  />
                  <Input
                    round
                    shadow
                    size="l"
                    variant="grayscale"
                    placeholder="Фокусируйте поле"
                  />
                  <Input round size="l" placeholder="Введите логин" />
                  <Input round shadow size="l" placeholder="Введите логин" />
                </Column>
                <Column>
                  <Input
                    round
                    size="l"
                    cleanable
                    variant="grayscale"
                    defaultValue="Nyaruko"
                    leftSlot={<SearchIcon />}
                  />
                  <Input
                    round
                    shadow
                    size="l"
                    cleanable
                    variant="grayscale"
                    leftSlot={<SearchIcon />}
                    placeholder="Фокусируйте поле"
                  />
                  <Input
                    round
                    size="l"
                    cleanable
                    leftSlot={<SearchIcon />}
                    placeholder="Введите логин"
                  />
                  <Input
                    round
                    shadow
                    size="l"
                    cleanable
                    leftSlot={<SearchIcon />}
                    placeholder="Введите логин"
                  />
                </Column>
              </Row>
            </Sample>
            <Sample label="Progress · регулируйте значение">
              <Progress size="s" defaultValue={4} />
              <Progress size="m" defaultValue={12} />
              <Progress size="l" defaultValue={2} />
            </Sample>
            <Sample label="Notification · варианты">
              <Button
                onClick={() => showNotification("Текст оповещения", "info")}
              >
                Info
              </Button>
              <Button
                onClick={() =>
                  showNotification("Изменения сохранены", "success")
                }
              >
                Success
              </Button>
              <Button
                onClick={() =>
                  showNotification("Изменения требуют внимания", "warning")
                }
              >
                Warning
              </Button>
              <Button
                onClick={() => showNotification("Произошла ошибка", "error")}
              >
                Error
              </Button>
            </Sample>
          </div>
        </Section>

        <Section title="Table · Skeleton">
          <div className={styles.samples}>
            <Sample label="Table">
              <div style={{ width: "400px" }}>
                <Table
                  numericList
                  items={[
                    { value: 82, label: "Фэнтези" },
                    { value: 69, label: "Комедия" },
                    { value: 50, label: "Экшен" },
                    { value: 32, label: "Драма" },
                    { value: 18, label: "Приключения" },
                  ]}
                />
              </div>
            </Sample>
            <Sample label="Table · percentage mode">
              <div style={{ width: "400px" }}>
                <Table
                  numericList
                  valueMode="percentage"
                  initialVisibleCount={7}
                  onItemClick={console.log}
                  items={[
                    { value: 85, label: "Милые девушки делают милые вещи" },
                    { value: 85, label: "Главная героиня" },
                    { value: 79, label: "Еда" },
                    { value: 79, label: "В основном женский состав" },
                    { value: 79, label: "Тюрьма" },
                    { value: 76, label: "Девушка монстр" },
                    { value: 73, label: "Демоны" },
                    { value: 71, label: "Иясикей" },
                    { value: 65, label: "Пытка" },
                    { value: 30, label: "Сюрреалистическая комедия" },
                  ]}
                />
              </div>
            </Sample>
            <Sample label="TableSkeleton">
              <div style={{ width: "400px" }}>
                <Column>
                  <TableSkeleton values={[82, 69, 50]} />
                  <TableSkeleton values={[32, 18]} />
                </Column>
              </div>
            </Sample>
          </div>
        </Section>
      </div>
    </main>
  );
}

export default App;
