import { Box, Spinner, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import fetchCommunityData from "components/admin/utils/fetchCommunityData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AdminCommunityPage = (): JSX.Element => {
  const [communityData, setCommunityData] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { chainId, account } = useWeb3React()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData?.themeColor || "#71717a"
  )

  const methods = useForm({ mode: "all" })

  const onSubmit = useSubmitLevelsData(
    setLoading,
    communityData?.levels?.length > 0 ? "PATCH" : "POST",
    communityData?.id,
    // Set preview cookies & redirect to the preview page
    () =>
      fetch(`/api/preview?urlName=${communityData.urlName}`)
        .then((res) => res.json())
        .then((cookies: string[]) => {
          cookies.forEach((cookie: string) => {
            document.cookie = cookie
          })

          router.push(`/${communityData.urlName}/community`)
        })
  )

  // Helper method for converting ms to month(s)
  const convertMsToMonths = (ms: number) => {
    if (!ms) return undefined

    return Math.round(ms * 3.8026486208174e-10)
  }

  // Fetch the communityData when we have the necessary info for it
  useEffect(() => {
    if (router.query.community && !communityData) {
      fetchCommunityData(router.query.community.toString()).then(
        (newCommunityData) => {
          if (!newCommunityData) {
            router.push("/404")
            return
          }
          setCommunityData(newCommunityData)
        }
      )
    }
  }, [router, chainId])

  // Set up the default form field values if we have the necessary data
  useEffect(() => {
    if (communityData) {
      /**
       * TODO!!! I think we should remove things like "tokenSymbol", "isTGEnabled",
       * "isDCEnabled", and "stakeToken" from the form, and provide it in a provider,
       * or as props, because we won't edit these values, and we also won't send them
       * to the API in POST/PATCH request, we just need them to implement some logic
       * in the form.
       */

      const discordServer =
        communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "DISCORD") || undefined

      // Reset the form state so we can watch the "isDirty" prop
      methods.reset({
        tokenSymbol:
          communityData.chainData?.length > 0
            ? communityData.chainData[0].token?.symbol
            : undefined,
        isTGEnabled: !!communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "TELEGRAM"),
        stakeToken: communityData.chainData.stakeToken,
        isDCEnabled: !!discordServer,
        discordServerId: discordServer?.platformId || undefined,
        inviteChannel: discordServer?.inviteChannel || undefined,
        levels: communityData.levels.map((level) => ({
          id: level.id,
          dbId: level.id, // Needed for proper form management
          name: level.name || undefined,
          image: level.imageUrl || undefined,
          description: level.description || undefined,
          requirementType: level.requirementType,
          requirement: level.requirement || undefined,
          stakeTimelockMs: convertMsToMonths(level.stakeTimelockMs),
          telegramGroupId: level.telegramGroupId || undefined,
        })),
      })
    }
  }, [communityData])

  // Redirect the user if they aren't the community owner
  useEffect(() => {
    if (
      communityData &&
      account &&
      account.toLowerCase() !== communityData.owner?.address
    ) {
      router.push(`/${communityData.urlName}`)
    }
  }, [account])

  // If the user isn't logged in, display an error message
  if (!chainId) {
    return (
      <NotConnectedError
        title={communityData ? `${communityData.name} - Levels` : "Loading..."}
      />
    )
  }

  // If we haven't fetched the community data / form data yet, display a spinner, otherwise render the admin page
  return (
    <>
      {!communityData || !methods ? (
        <Box sx={generatedColors}>
          <VStack pt={16} justifyItems="center">
            <Spinner size="xl" />
          </VStack>
        </Box>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FormProvider {...methods}>
              <Box sx={generatedColors}>
                <Layout
                  title={`${communityData.name} - Levels`}
                  imageUrl={communityData.imageUrl}
                >
                  {account &&
                    account.toLowerCase() === communityData.owner?.address && (
                      <Stack spacing={{ base: 7, xl: 9 }}>
                        <Pagination
                          doneBtnUrl="community"
                          isAdminPage
                          saveBtnLoading={loading}
                          onSaveClick={
                            methods.formState.isDirty &&
                            methods.handleSubmit(onSubmit)
                          }
                        />
                        <VStack pb={{ base: 16, xl: 0 }} spacing={12}>
                          <Platforms
                            comingSoon={communityData?.levels?.length > 0}
                            activePlatforms={communityData.communityPlatforms.filter(
                              (platform) => platform.active
                            )}
                          />
                          <Levels />
                        </VStack>
                      </Stack>
                    )}
                </Layout>
              </Box>
            </FormProvider>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}

export default AdminCommunityPage
