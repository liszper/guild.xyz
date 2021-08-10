import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useFormContext } from "react-hook-form"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Section
      title="Used token"
      description="The token that members will have to stake or hold to access non-open levels"
      cardType
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={12}>
        <GridItem>
          <FormControl>
            <FormLabel>Token name or address</FormLabel>
            <InputGroup>
              <Input
                {...register("token", { required: true })}
                isInvalid={!!errors.token}
              />
              <InputRightAddon>ETHANE</InputRightAddon>
            </InputGroup>
          </FormControl>
        </GridItem>
      </Grid>
    </Section>
  )
}

export default UsedToken