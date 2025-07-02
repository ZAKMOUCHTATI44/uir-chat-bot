import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Document } from "@prisma/client";

export const run = async () => {
  const db = new PrismaClient();
  const vectorStore = PrismaVectorStore.withModel<Document>(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        question: PrismaVectorStore.ContentColumn,
        answer: PrismaVectorStore.ContentColumn,
      },
    }
  );

  interface Faq {
    question: string;
    answer: string;
  }

  const faqs: Faq[] = [
    {
      question: "L'UIR est-elle reconnue par l'État marocain ?",
      answer:
        "Oui, l’Université Internationale de Rabat (UIR) est reconnue par l’État marocain depuis 2015, avec un renouvellement en 2020. Cette reconnaissance garantit que ses diplômes sont équivalents à ceux délivrés par les universités publiques marocaines.",
    },
    {
      question:
        "Les diplômes de l'UIR sont-ils équivalents aux diplômes nationaux ?",
      answer:
        "Oui. Les diplômes de l’UIR sont équivalents aux diplômes nationaux, car l’université est reconnue par l’État marocain depuis 2015, avec un renouvellement en 2020.",
    },
    {
      question: "Quel est le statut juridique de l'UIR ?",
      answer:
        "L’Université Internationale de Rabat (UIR) est une université privée à but non lucratif, créée dans le cadre d’un partenariat public-privé avec l’État marocain.",
    },
    {
      question: "Rabat Business School est-elle accréditée par l'AACSB ?",
      answer:
        "Oui. Rabat Business School est accréditée AACSB, un label d’excellence détenu par moins de 5 % des business schools dans le monde.",
    },
    {
      question:
        "L'UIR dispose-t-elle du label EUR-ACE pour ses formations en ingénierie ?",
      answer:
        "Oui. Les écoles d’ingénieurs de l’UIR sont labellisées EUR-ACE et accréditées par la CTI, ce qui garantit la qualité européenne des formations en ingénierie.",
    },
    {
      question:
        "Quels sont les partenaires académiques internationaux de l'UIR ?",
      answer:
        "L’UIR compte 262 partenariats académiques dans 57 pays. Ces accords permettent des échanges, doubles diplômes, programmes conjoints et mobilité étudiante, notamment en Europe, Amérique et Asie.",
    },
    {
      question: "L'UIR propose-t-elle des doubles diplômes ?",
      answer:
        "Oui. L’UIR propose plusieurs doubles diplômes en partenariat avec des universités internationales, notamment en Europe, en Amérique du Nord et en Asie. Ces accords concernent plusieurs collèges, dont Rabat Business School et les écoles d’ingénieurs.",
    },
    {
      question: "Quelle est la superficie du campus de l'UIR ?",
      answer: "Le campus de l’UIR s’étend sur 30 hectares.",
    },
    {
      question: "Quelles infrastructures sont disponibles sur le campus ?",
      answer:
        "Le campus de l’UIR dispose de : 🏡 résidences, 📚 bibliothèque, 🍽️ restauration, 🏊‍♂️ piscine, ⚽ terrains de sport, 🧪 laboratoires, 💡 Tech Center, 🏥 hôpital universitaire, 🌱 campus HQE.",
    },
    {
      question: "Combien de brevets ont été déposés par l'UIR ?",
      answer:
        "L’UIR a déposé 650 brevets, dont 108 à l’international, ce qui en fait la 1ère université en Afrique et dans la région MENA en matière de brevets (source : OMPIC).",
    },
    {
      question:
        "Combien de chercheurs de l'UIR figurent parmi les 2 % des meilleurs mondiaux ?",
      answer:
        "6 chercheurs de l’UIR figurent parmi les 2 % des meilleurs scientifiques au monde, selon le classement de l’Université Stanford.",
    },
    {
      question: "L'UIR possède-t-elle un hôpital universitaire ?",
      answer:
        "Oui. L’UIR dispose d’un Hôpital Universitaire International en cours de finalisation, avec une ouverture prévue en 2025. Il comptera 450 lits et proposera des soins dans 15 spécialités médicales et chirurgicales.",
    },
    {
      question: "Le campus de l'UIR est-il certifié HQE ?",
      answer:
        "Oui. Le campus de l’UIR est certifié HQE (Haute Qualité Environnementale) — c’est le premier campus en Afrique à avoir obtenu cette distinction.",
    },
    {
      question: "L'UIR dispose-t-elle d'une centrale photovoltaïque ?",
      answer:
        "Oui. L’UIR dispose d’une centrale photovoltaïque sur son campus, avec une capacité de production annuelle de 470 MWh. Elle fait partie des équipements durables du campus",
    },
    {
      question: "Comment contacter l'UIR pour des informations générales ?",
      answer: "",
    },
    {
      question:
        "Quels dossiers seront pris en compte pour l'obtention d'une bourse à l'UIR ?",
      answer:
        "Seuls les dossiers de bourse déposés en ligne seront traités par nos services. Les dossiers incomplets ou déposés hors-délais seront systématiquement rejetés.",
    },
    {
      question:
        "Quels dossiers seront pris en compte pour l'obtention d'une bourse à l'UIR ?",
      answer:
        "Seuls les dossiers de bourse déposés en ligne seront traités par nos services. Les dossiers incomplets ou déposés hors-délais seront systématiquement rejetés.",
    },
    {
      question:
        "Est-ce que les étudiants ayant déjà bénéficié d'une bourse peuvent faire un recours ?",
      answer:
        "Non, les étudiants ayant déjà bénéficié d'une bourse et qui font un recours ne peuvent, en aucun cas, redéposer leurs demandes en ligne.",
    },
    {
      question: "Est-ce que la bourse est reconduite en cas de redoublement ?",
      answer:
        "Non, la bourse octroyée par l'UIR n'est pas reconduite en cas de redoublement.",
    },
    {
      question: "Quels frais sont couverts par la bourse de l'UIR ?",
      answer:
        "La bourse octroyée par l'UIR couvre exclusivement les frais de scolarité à l'UIR, que ce soit partiellement ou totalement. Elle ne couvre pas les frais de scolarité qui sont dus chez les partenaires académiques de l'UIR, par exemple, dans le cas de cursus en double diplomation.",
    },
    {
      question: "Quelles sont les bourses d'études proposées par l'UIR ?",
      answer:
        "L'UIR propose des bourses d'études partielles ou totales réservées aux meilleurs étudiants qui se trouvent dans l'incapacité de payer les frais de scolarité.",
    },
    {
      question: "Qu'est-ce que la bourse d'études couvre-t-elle ?",
      answer: `La bourse d'études correspond à une réduction partielle ou à une exonération totale des frais de scolarité, et éventuellement des frais de logement. Elle est destinée aux étudiants issus de milieux défavorisés ou modestes. Les détails sur les modalités de la bourse sont décrits dans le "Règlement pour l'octroi d'une bourse d'études".`,
    },
    {
      question:
        "Quels documents sont nécessaires pour constituer le dossier de bourse ?",
      answer: `Le dossier de bourse comprend le formulaire de bourse à renseigner en ligne, ainsi que d'autres pièces demandées. Vous devez le déposer en ligne à partir de "bourse.uir.ac.ma" en utilisant votre adresse e-mail UIR et votre mot de passe. Ce dossier permettra à l'UIR de prendre connaissance de votre situation financière et familiale actuelle. Assurez-vous de fournir toutes les pièces demandées pour permettre à la commission d'évaluer votre dossier de manière appropriée. Soyez assuré que toutes les informations transmises à la commission sont confidentielles.`,
    },
    {
      question: "Quels types de bourses propose l’UIR ?",
      answer:
        "L’UIR propose 3 types de bourses selon les profils : Bourse sociale Bourse sportive Bourse sociale  Bourse spéciale",
    },
    {
      question: "Qu’est-ce qu’une bourse sociale ?",
      answer:
        "La bourse sociale est destinée aux étudiants dont la situation financière nécessite un soutien. Elle est attribuée sur critères sociaux après étude de dossier.",
    },
    {
      question: "Qu’est-ce qu’une bourse sportive ?",
      answer:
        "La bourse sportive est accordée aux étudiants ayant un excellent niveau sportif, reconnu par un palmarès ou une participation à des compétitions officielles.",
    },
    {
      question: "Qu’est-ce qu’une bourse spéciale ?",
      answer:
        "La bourse spéciale est octroyée dans le cadre de partenariats spécifiques ou selon certains critères prédéfinis (institutionnels, associatifs, etc.).",
    },
    {
      question: "Peut-on cumuler plusieurs bourses ?",
      answer:
        "Non, il n’est pas possible de cumuler plusieurs bourses à l’UIR. Une seule bourse peut être attribuée par étudiant, selon le type de dossier.",
    },
    {
      question: "Où déposer ma demande de bourse ?",
      answer:
        "Rendez-vous sur bourse.uir.ac.ma pour remplir le formulaire et soumettre les documents demandés.",
    },
    {
      question: "Où déposer ma demande de bourse ?",
      answer:
        "Rendez-vous sur bourse.uir.ac.ma pour remplir le formulaire et soumettre les documents demandés.",
    },
    {
      question: "Est-ce que l’UIR est une université publique ?",
      answer:
        "L’Université Internationale de Rabat est une université semi-publique. Elle est la première université marocaine créée en partenariat avec l’Etat marocain concrétisant ainsi le premier partenariat public-privé dans le secteur de l’enseignement supérieur.",
    },
    {
      question: "L’UIR est-elle reconnue par l’état ?",
      answer:
        "L’Université Internationale de Rabat est reconnue par l’Etat. La reconnaissance signifie que les diplômes délivrés par l’UIR sont équivalents aux diplômes délivrés par les établissements publics, permettant ainsi d’accéder à la fonction publique, aux concours d’Etat et aux centres doctoraux.",
    },
    {
      question: "Quels sont les établissements ou les écoles de l’UIR ?",
      answer: `L’Université Internationale de Rabat est constituée de 4 collèges distincts, chaque collège englobe à son tour plusieurs écoles/facultés :
  Collège of  Social Sciences
  Sciences Po
  Ecole de droit de Rabat
  IHECS Afrique communication et Médias
  Collège of Engineering & Architecture
  Ecole Supérieure d’Ingénierie de l’Energie
  School of Aerospace Engineering & Automotive Engineering
  Ecole Supérieure d’Informatique et du Numérique
  Ecole d'Ingénierie en Topographie de Rabat
  Ecole d’Architecture de Rabat
  Collège of Health Sciences
  Faculté Internationale de Médecine Dentaire
  Faculté Internationale de Médecine de Rabat
  Ecole Supérieure des Sciences Paramédicales de Rabat
  Collège of Management
  Rabat Business School `,
    },
    {
      question: "Pourquoi s’inscrire à l’UIR ?",
      answer: `L’Université Internationale de Rabat est la première université créée dans le cadre d’un partenariat public-privé au Maroc, elle propose une offre de formation pluridisciplinaire élargie avec différentes filières dans des domaines de pointe (ingénierie, sciences politiques, communication, média, architecture, médecine dentaire, management)   
  L’UIR est dotée d’un campus moderne sur 300 000 m2 (30 hectares) permettant aux étudiants de vivre une expérience unique, épanouie et riche. `,
    },
    {
      question:
        "Comment puis-je choisir pour quel établissement de l’UIR candidater ?",
      answer:
        "Le choix de l’établissement revient à faire un choix par rapport au métier que tu souhaites exercer dans le futur. Le département promotion de l’UIR se charge de t’orienter et répondre à toutes tes questions.",
    },
    {
      question:
        "Y-a-t-il un processus d’accompagnement lors de la première année à l’UIR ?",
      answer: `A chaque rentrée universitaire, l’Université Internationale de Rabat accorde une grande importance à l’intégration de ses nouveaux étudiants, elle organise ainsi une semaine d’intégration pour les accueillir dans cette nouvelle aventure. En plus de la semaine d’intégration, différentes activités sont mises en place en coordination avec le BDE (Bureau Des Etudiants) afin de faire découvrir aux nouveaux le campus, les anciens étudiants ainsi que pour se familiariser avec le staff administratif et professeurs.
      
  Après cette semaine, l’UIR accompagne activement ses étudiants tout au long de leur cursus universitaire, le corps professoral et administratif sont tous impliqués que ça soit dans le cadre des études et échanges à l’international, ou via une cellule d’écoute, un service pour l’assistance lors de la recherche de stage et un département spécial pour la vie estudiantine et associative des étudiants.`,
    },
    {
      question:
        "Existe-t-il un service d’orientation et accompagnement pour les bacheliers ?",
      answer:
        "L’UIR est dotée d’un département promotion qui se charge d’orienter les étudiants et de répondre à leurs interrogations.",
    },
    {
      question: "Existe-t-il des programmes en anglais ?",
      answer: `Oui, l’Université Internationale de Rabat propose des programmes en anglais tels que dans l’école de management « Rabat Business School », l'école d’ingénierie automobile et aéronautique.
      
  Dans les autres programmes, l’anglais est une langue qui occupe tout aussi bien une grande importance, elle y est enseignée tout au long du parcours universitaire.    `,
    },
    {
      question:
        "Puis-je changer de programme de formation au cours d’une année universitaire ?",
      answer:
        "Non, il est impossible de changer de programme de formation au cours d’une année universitaire, il faut attendre la fin de l’année universitaire pour le faire.",
    },
    {
      question:
        "Quelle est la différence entre la formation initiale et la formation continue ?",
      answer:
        "La formation initiale est un type de formation destinée aux étudiants principalement, à l’inverse de la formation continue qui s’adresse aux professionnels (salariés, entrepreneurs, fonctionnaires) ou aux personnes dotées d’une expérience professionnelle et qui envisagent de se former pour diverses raisons (obtenir un diplôme de niveau supérieur, se reconvertir, changer de spécialisation…)",
    },
    {
      question: "Que comprennent les frais de scolarité à l’UIR ?",
      answer: `Les frais de scolarité couvrent :
  L’enseignement académique de haut niveau
  L’accès aux infrastructures sportives
  Les cours de langues optionnels
  Les frais ne couvrent pas : transport, restauration, hébergement ou dépenses personnelles.`,
    },
    {
      question: "Quel est le montant des frais d’inscription à l’UIR ?",
      answer: `Les frais d’inscription varient selon les collèges :
  10 000 DHS pour la majorité des formations
  20 000 DHS pour le programme ITB (Collège de Management)
  📌 Ces frais sont non remboursables.`,
    },
    {
      question: "Quels sont les frais de scolarité pour un bachelier ?",
      answer: `Cela dépend du programme choisi. Voici quelques exemples :
  Médecine : 120 000 DHS/an
  Architecture : 85 000 DHS/an
  Droit, Économie, Sciences Politiques… : 62 000 DHS/an
   Les frais sont annuels, à régler à l’inscription.`,
    },
    {
      question: "Comment puis-je payer mes frais de scolarité ?",
      answer: `Trois options sont disponibles :
  Paiement en ligne par carte bancaire via le site web
  Virement ou versement bancaire auprès d’une agence CIH Bank
  Paiement par chèque bancaire`,
    },
    {
      question: "Quelles sont les coordonnées bancaires de l’UIR ?",
      answer: `Pour les étudiants marocains :
  RIB : CIH BANK 230 810 594 293 822 101 460 075
  Swift : CIHMMAMC
  Bénéficiaire : Université Internationale de Rabat
  
  📌 Pour les étudiants internationaux :
  IBAN : CIH BANK MA64230810594293822103320341
  Swift : CIHMMAMC
  Bénéficiaire : Université Internationale de Rabat`,
    },
    {
      question:
        "Quels sont les premiers pas pour soumettre une candidature à l’UIR après le bac ?",
      answer:
        "1. Créer un compte candidat sur : https://candidature.uir.ac.ma\n2. Renseigner vos informations personnelles et académiques\n3. Sélectionner la ou les filières de votre choix\n4. Régler les frais de concours : 750 Dhs pour 2 concours, 1500 Dhs pour plus de 2",
    },
    {
      question:
        "Je souhaite intégrer un master à l’UIR, comment dois-je procéder ?",
      answer:
        "1. Créer un compte candidat sur : https://candidature.uir.ac.ma/fr/register-superieur\n2. Renseigner vos informations personnelles et académiques\n3. Sélectionner la ou les filières de votre choix",
    },
    {
      question:
        "Comment effectuer le paiement des frais pour les concours de l’UIR ?",
      answer:
        "Les frais peuvent être réglés par carte bancaire sur le site, ou par virement bancaire auprès d’une banque CIH. Une fois le virement effectué, scanner le justificatif avec nom/prénom et l’envoyer à comptable@uir.ac.ma",
    },
    {
      question:
        "Est-il possible de rencontrer un conseiller pour discuter de mon projet d'études ?",
      answer:
        "Utilisez le lien suivant pour prendre rendez-vous : https://allouir.uir.ac.ma/",
    },
    {
      question:
        "Qui contacter pour des questions générales sur les admissions à l’UIR ?",
      answer: "Tél : +212 (0)5 30 10 40 63\nEmail : concours@uir.ac.ma",
    },
    {
      question: "Où puis-je consulter les formations proposées par l’UIR ?",
      answer:
        "Le catalogue est disponible ici : https://www.uir.ac.ma/upload/media/67f9219a3b152115732768.pdf",
    },
    {
      question:
        "Quand auront lieu les épreuves orales pour les filières comme Droit ou Économie ?",
      answer:
        "Les concours sont oraux et ont lieu les : 12 avril, 10 mai, 17 juin, 18 juillet, 3 septembre",
    },
    {
      question:
        "Combien dois-je prévoir pour les frais de scolarité si je choisis la filière Médecine ?",
      answer:
        "Médecine : 120 000 Dhs/an. D’autres frais peuvent s’ajouter selon le programme. Des frais d’inscription s’appliquent aussi (généralement 10 000 ou 20 000 Dhs).",
    },
    {
      question:
        "Quels documents les étudiants étrangers doivent-ils préparer pour s’inscrire ?",
      answer:
        "Créer un compte candidat, fournir les pièces demandées (dont équivalence), prendre rendez-vous pour finaliser l’inscription. Documents spécifiques disponibles selon diplôme (bac, post-bac).",
    },
    {
      question:
        "Je suis dans une situation financière difficile, l’UIR peut-elle m’aider ?",
      answer:
        "Oui. Vous pouvez faire une demande de bourse sur https://bourse.uir.ac.ma avec votre email UIR. Remplissez le formulaire en ligne et joignez les pièces demandées.",
    },
    {
      question: "Y a-t-il des frais pour passer les concours à l’UIR ?",
      answer:
        "Oui. 750 Dhs pour 2 concours, 1500 Dhs pour plusieurs concours. Ces frais ne sont pas remboursables.",
    },
    {
      question: "Combien coûte un logement en résidence UIR par mois ?",
      answer:
        "Les tarifs varient selon l’étage et le type de chambre. Par exemple : Chambre simple au RDC : 2950 Dhs, Chambre simple + 4ème étage : 3675 Dhs.",
    },
    {
      question: "Qui est responsable des logements étudiants à l’UIR ?",
      answer:
        "M. Mustapha Iguilem — Email : mustapha.iguilem@uir.ac.ma — Tél : +212 (0)5 30 10 30 43",
    },
    {
      question: "L’UIR propose-t-elle des prêts bancaires pour les étudiants ?",
      answer:
        "Oui, avec la Banque Populaire. Prêt bonifié jusqu’à 50 000 Dhs/an selon le cycle. UIR prend en charge les intérêts pendant les études.",
    },
    {
      question: "À quelle date démarre la rentrée universitaire à l’UIR ?",
      answer:
        "Le calendrier de la rentrée universitaire 2025–2026 sera communiqué ultérieurement.",
    },
    // === SCIENCES DE LA SANTÉ (2026) ===
    {
      question:
        "Quand a lieu le concours commun Médecine et Médecine Dentaire en 2026 ?",
      answer:
        "Aucune date spécifique n'est mentionnée pour le concours commun Médecine/Dentaire en 2026 dans le calendrier fourni.",
    },
    {
      question:
        "Quand sont les épreuves pour la Licence en Biotechnologie en 2026 ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 07 mai<br>- 24 juin<br>- 24 juillet<br>- 30 août.",
    },
    {
      question: "Quand est le concours de Génie Biomédical en 2026 ?",
      answer:
        "Les dates sont :<br>- 14 mai<br>- 23 juin<br>- 14 juillet<br>- 17 juillet<br>- 27 août (tous en écrit+oral).",
    },
    // === SCIENCES DE LA SANTÉ ===
    {
      question:
        "Quand a lieu le concours commun Médecine et Médecine Dentaire ?",
      answer:
        "Aucune date spécifique n'est mentionnée pour le concours commun Médecine/Dentaire dans le calendrier fourni.",
    },
    {
      question: "Quand sont les épreuves pour la Licence en Biotechnologie ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 07 mai<br>- 24 juin<br>- 24 juillet<br>- 30 août.",
    },
    {
      question: "Quand est le concours de Génie Biomédical ?",
      answer:
        "Les dates sont :<br>- 14 mai<br>- 23 juin<br>- 14 juillet<br>- 17 juillet<br>- 27 août (tous en écrit+oral).",
    },

    // === SCIENCES PARAMÉDICALES ===
    {
      question: "Quand ont lieu les concours pour Infirmier Polyvalent ?",
      answer:
        "Les dates sont :<br>- 06 mai<br>- 25 juin<br>- 23 juillet<br>- 13 septembre (tous en écrit+oral).",
    },
    {
      question:
        "Quand est le concours pour Infirmier en Anesthésie et Réanimation ?",
      answer:
        "Les dates sont :<br>- 06 mai<br>- 25 juin<br>- 23 juillet<br>- 13 septembre (tous en écrit+oral).",
    },
    {
      question: "Quand est l'oral pour Technicien d'Imagerie Médicale ?",
      answer:
        "Les oraux (avec étude de dossier) ont lieu aux mêmes dates que les écrits :<br>- 06 mai<br>- 25 juin<br>- 23 juillet<br>- 13 septembre.",
    },
    {
      question:
        "Quand sont les épreuves pour la Licence en Nutrition et Diététique ?",
      answer:
        "Les épreuves (étude de dossier + oral) ont lieu les :<br>- 06 mai<br>- 25 juin<br>- 23 juillet<br>- 13 septembre.",
    },
    {
      question: "Quand est le concours pour Technicien de Laboratoire ?",
      answer:
        "Les épreuves (étude de dossier + oral) ont lieu les :<br>- 06 mai<br>- 25 juin<br>- 23 juillet<br>- 13 septembre.",
    },
    // === GÉNIE CIVIL ===
    {
      question: "Quand ont lieu les concours de Génie Civil ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 03 mai<br>- 22 juin<br>- 16 juillet<br>- 29 août.",
    },

    // === INGÉNIERIE AÉROSPATIALE ET AUTOMOBILE ===
    {
      question:
        "Quand sont les concours d'Ingénierie Aérospatiale et Automobile ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 03 mai<br>- 22 juin<br>- 16 juillet<br>- 29 août.",
    },

    // === INGÉNIERIE INFORMATIQUE ===
    {
      question: "Quand est le concours d'Ingénierie Informatique ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 03 mai<br>- 22 juin<br>- 16 juillet<br>- 29 août.",
    },

    // === INGÉNIERIE DE L'ÉNERGIE ===
    {
      question: "Quand ont lieu les concours d'Ingénierie de l'Énergie ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 03 mai<br>- 22 juin<br>- 16 juillet<br>- 29 août.",
    },

    // === ARCHITECTURE ===
    {
      question: "Quand sont les épreuves d'Architecture ?",
      answer:
        "Les épreuves (écrit+oral) ont lieu les :<br>- 03 mai<br>- 04 mai<br>- 21 juin<br>- 22 juin<br>- 15 juillet<br>- 16 juillet<br>- 28 août<br>- 29 août.",
    },

    // QUESTIONS SPÉCIFIQUES PAR DATE
    {
      question: "Quels concours ont lieu le 03 mai ?",
      answer:
        "Le 03 mai ont lieu les concours (écrit+oral) de :<br>- Génie Civil<br>- Ingénierie Aérospatiale et Automobile<br>- Ingénierie Informatique<br>- Ingénierie de l'Énergie<br>- Architecture",
    },
    {
      question: "Quels concours ont lieu le 04 mai ?",
      answer:
        "Le 04 mai a lieu uniquement le concours d'Architecture (écrit+oral).",
    },
    {
      question: "Quand sont les épreuves écrites pour l'IPM à RBS ?",
      answer:
        "Les écrits pour l'IPM ont lieu :<br>- 18 juin (écrit)<br>- 4 juillet (écrit)",
    },
    {
      question: "Quand sont les oraux pour l'IPM à RBS ?",
      answer:
        "Les oraux pour l'IPM ont lieu :<br>- 25 juin (oral)<br>- 11 juillet (oral)",
    },

    // === PGE1 ===
    {
      question: "Quand a lieu le concours écrit du PGE1 ?",
      answer: "L'écrit du PGE1 a lieu le 18 juin.",
    },
    {
      question: "Quand est l'oral du PGE1 ?",
      answer: "L'oral du PGE1 a lieu le 25 juin.",
    },

    // === ITB ===
    {
      question: "Quand est l'examen écrit pour l'ITB ?",
      answer: "L'écrit pour l'ITB a lieu le 12 avril.",
    },
    {
      question: "Quand est l'entretien oral pour l'ITB ?",
      answer: "L'oral pour l'ITB a lieu le 19 avril.",
    },

    // === MASTERS RBS/PGE2 ===
    {
      question: "Quand ont lieu les épreuves pour les masters RBS ?",
      answer: "Les masters RBS/PGE2 ont leurs épreuves (écrit+oral) le 17 mai.",
    },

    // === QUESTIONS PAR DATE ===
    {
      question: "Quels concours ont lieu le 18 juin ?",
      answer: "Le 18 juin ont lieu :<br>- Écrit IPM<br>- Écrit PGE1",
    },
    {
      question: "Quels programmes passent des épreuves en avril ?",
      answer: "En avril :<br>- ITB : écrit le 12, oral le 19",
    },
    {
      question: "Quels concours ont lieu en juillet ?",
      answer: "En juillet :<br>- IPM : écrit le 4, oral le 11",
    },
    {
      question: "Quand sont les oraux de Sciences Po ?",
      answer:
        "Les oraux de Sciences Po ont lieu aux dates suivantes :<br>- 12 avril<br>- 10 mai<br>- 17 juin<br>- 18 juillet<br>- 03 septembre",
    },

    // === PSYCHOLOGIE ===
    {
      question: "Quand ont lieu les concours de Psychologie ?",
      answer:
        "Les oraux de Psychologie se déroulent aux dates suivantes :<br>- 12 avril<br>- 10 mai<br>- 17 juin<br>- 18 juillet<br>- 03 septembre",
    },

    // === DROIT ===
    {
      question: "Quelles sont les dates des oraux de Droit ?",
      answer:
        "Les épreuves orales de Droit ont lieu :<br>- 12 avril<br>- 10 mai<br>- 17 juin<br>- 18 juillet<br>- 03 septembre",
    },

    // === ECONOMIE ===
    {
      question: "Quand se passent les oraux d'Économie ?",
      answer:
        "Les oraux d'Économie sont prévus aux dates :<br>- 12 avril<br>- 10 mai<br>- 17 juin<br>- 18 juillet<br>- 03 septembre",
    },

    // === COMMUNICATION & MÉDIAS ===
    {
      question: "Quand sont les épreuves de Communication et Médias ?",
      answer:
        "Les oraux de Communication & Médias ont lieu :<br>- 12 avril<br>- 10 mai<br>- 17 juin<br>- 18 juillet<br>- 03 septembre",
    },

    // === QUESTIONS PAR DATE ===
    {
      question: "Quels concours ont lieu le 12 avril ?",
      answer:
        "Le 12 avril ont lieu les oraux de :<br>- Sciences Po<br>- Psychologie<br>- Droit<br>- Économie<br>- Communication & Médias",
    },
    {
      question: "Quels examens se déroulent en mai ?",
      answer: "En mai :<br>- Tous les oraux (toutes filières) le 10 mai",
    },
    {
      question: "Y a-t-il des concours en septembre ?",
      answer:
        "Oui, le 03 septembre ont lieu les oraux pour toutes les filières :<br>- Sciences Po<br>- Psychologie<br>- Droit<br>- Économie<br>- Communication & Médias",
    },
  ];

  await vectorStore.addModels(
    await db.$transaction(
      faqs.map((content) =>
        db.document.create({
          data: { question: content.question, answer: content.answer },
        })
      )
    )
  );

  const resultOne = await vectorStore.similaritySearch(
    "Rabat Business School est-elle accréditée par l'AACSB ?",
    1
  );
  console.log(resultOne);

  // create an instance with default filter
  const vectorStore2 = PrismaVectorStore.withModel<Document>(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        question: PrismaVectorStore.ContentColumn,
        answer: PrismaVectorStore.ContentColumn,
      },
      filter: {
        question: {
          equals: "default",
        },
      },
    }
  );

  await vectorStore2.addModels(
    await db.$transaction(
      faqs.map((content) =>
        db.document.create({
          data: { question: content.question, answer: content.answer },
        })
      )
    )
  );

  // Use the default filter a.k.a {"content": "default"}
  const resultTwo = await vectorStore.similaritySearch(
    "Do you open on Sundays?",
    5
  );
  console.log("*********");
  console.log(resultTwo);
  console.log("*********");
};

run();
