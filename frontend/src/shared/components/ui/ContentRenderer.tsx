import { Text } from '@shared/components/ui/Text';

interface ContentBlock {
  type: string;
  content: string;
}

interface Props {
  content: ContentBlock[];
}

const ContentRenderer = ({ content }: Props) => {
  return (
    <>
      {content.map((block, idx) => {
        if (block.type.toLowerCase() === 'image') {
          return (
            <img
              key={`${block.type}-${idx}`}
              src={block.content}
              alt={`content-${idx}`}
              className="w-full rounded-lg object-cover"
            />
          );
        }

        return (
          <Text
            key={`${block.type}-${idx}`}
            as="p"
            variant="h3"
            weight="regular"
          >
            {block.content}
          </Text>
        );
      })}
    </>
  );
};

export default ContentRenderer;
