import { Text, useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { HoldTypeColors, Requirement } from "temporaryData/guilds"

type Props = {
  requirement: Requirement
}

const RequirementCard = ({ requirement }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  // We could extract this logic into a hook later if needed
  let cardTitle = ""

  switch (requirement.holdType) {
    case "NFT":
      cardTitle = `Own a(n) ${requirement.nft}`
      break
    case "POAP":
      cardTitle = `Own the ${requirement.poap}`
      break
    case "TOKEN":
      cardTitle = `Hold at least ${requirement.tokenQuantity} ${requirement.token}`
      break
    default:
      cardTitle = ""
  }

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      py="7"
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={HoldTypeColors[requirement.holdType]}
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
      _hover={{
        _before: {
          opacity: 0.1,
        },
      }}
      _active={{
        _before: {
          opacity: 0.17,
        },
      }}
    >
      <VStack spacing={4} alignItems="start">
        <Text fontWeight="bold" letterSpacing="wide">
          {cardTitle}
        </Text>
      </VStack>
    </Card>
  )
}

export default RequirementCard
